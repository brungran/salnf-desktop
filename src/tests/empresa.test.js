import empresa from '../db/models/empresa.js';
import { expect, it, test } from 'vitest';
import { Faker, pt_BR, en, simpleFaker } from '@faker-js/faker';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import { test_db } from '../db/db.js';
import schema from '../db/schema.js';

dayjs.extend(customParseFormat)
dayjs.extend(utc)

const customFaker = new Faker({ locale: [pt_BR, en] });
const expectedObject = {changes: 1}

function get_DB(){
    const db = test_db();
    schema(db).setup();
    return db;
}

function randomEmpresa(){
    return {
        'id': simpleFaker.number.int({min: 1}),
        'cnpj': simpleFaker.string.numeric(14),
        'nome': customFaker.company.name(),
        'razao': customFaker.company.catchPhrase(),
        'vencimento': customFaker.date.soon(15).toLocaleDateString('en-CA'),
        'acesso': customFaker.internet.exampleEmail(),
        'obs': simpleFaker.string.alphanumeric(100),
    }
}

function parseDateInput(input) {
  const parsed = dayjs(input, 'DD/MM/YYYY', true) // true = modo estrito
  if (!parsed.isValid()) {
    throw new Error(`Data inválida: ${input}`)
  }
  return parsed.utc().format('YYYY-MM-DD') // saída no formato do banco
}




it('não insere empresa com campo inexistente na tabela', () => {
    const emp = randomEmpresa();
    emp.endereço = customFaker.location.streetAddress();
    expect(() => empresa(get_DB()).insert(emp)).toThrowError();
})
// id ///////////////////////////////////////////////////////////////////////
//insert
test.each([
    simpleFaker.string.alpha(),
    simpleFaker.number.int(10) * (-1),
    0,
    simpleFaker.number.float(),
    "      ",
    "",
])(`não insere empresa com id inválido igual a %s`, (data) => {
    const emp = randomEmpresa();
    emp.id = data;
    expect(() => empresa(get_DB()).insert(emp)).toThrowError();
})
test.each([
    simpleFaker.number.int(),
    simpleFaker.string.numeric(),
    null,
    undefined,
])('insere empresa com id válido igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.id = data;
    const result = empresa(get_DB()).insert(emp);
    expect(result).toMatchObject(expectedObject);
})


//select
it("dá select all na tabela", () => {
    const db = get_DB();
    empresa(db).insert(randomEmpresa());
    empresa(db).insert(randomEmpresa());
    empresa(db).insert(randomEmpresa());
    expect(empresa(db).all()).toEqual(expect.arrayContaining(
        [{
            "id": expect.any(Number),
            "cnpj": expect.any(String),
            "nome": expect.any(String),
            "razao": expect.any(String),
            "vencimento": expect.any(String),
            "acesso": expect.any(String),
            "obs": expect.any(String)
        }]
    ));
})
it("busca empresas com certos campos com certas condições", () => {
    const db = get_DB();
    const emp = randomEmpresa();
    empresa(db).insert(emp);
    empresa(db).insert(randomEmpresa());
    empresa(db).insert(randomEmpresa());
    const fields = {
        "id": expect.any(Number),
        "nome": expect.any(String),
    };
    const where = {
        "id" : emp.id,
        "cnpj": emp.cnpj
    }
    expect(empresa(db).select(Object.keys(fields), where)).toEqual(expect.arrayContaining([fields]));
})
it("não busca empresas com campos inexistentes", () => {
    const db = get_DB();
    const emp = randomEmpresa();
    empresa(db).insert(emp);
    empresa(db).insert(randomEmpresa());
    empresa(db).insert(randomEmpresa());
    const fields = {
        "id": expect.any(Number),
        "endereço": expect.any(String),
    };
    const where = {
        "id" : emp.id,
        "cnpj": emp.cnpj
    }
    expect(() => empresa(db).select(Object.keys(fields), where)).toThrowError();
})
it("não busca empresas com campos inexistentes na cláusula where", () => {
    const db = get_DB();
    const emp = randomEmpresa();
    empresa(db).insert(emp);
    empresa(db).insert(randomEmpresa());
    empresa(db).insert(randomEmpresa());
    const fields = {
        "id": expect.any(Number),
        "cnpj": expect.any(String),
    };
    const where = {
        "id" : emp.id,
        "endereço": customFaker.location.streetAddress()
    }
    expect(() => empresa(db).select(Object.keys(fields), where)).toThrowError();
})
it("retorna resultado vazio ao buscar empresas com condições insatisfeitas", () => {
    const db = get_DB();
    const emp = randomEmpresa();
    empresa(db).insert(emp);
    empresa(db).insert(randomEmpresa());
    empresa(db).insert(randomEmpresa());
    const fields = {
        "id": expect.any(Number),
        "cnpj": expect.any(String),
    };
    const where = {
        "id" : simpleFaker.number.int(),
    }
    expect(empresa(db).select(Object.keys(fields), where)).toHaveLength(0);
})

// cnpj ///////////////////////////////////////////////////////////////////////
test.each([
    simpleFaker.string.alphanumeric(14),
    simpleFaker.string.numeric(13),
    simpleFaker.string.numeric(15),
    Number(simpleFaker.string.numeric(14)) * (-1),
    Number(simpleFaker.string.numeric(13)) * (-1),
    14.002000000701,
    "      ",
    ''
])(`não insere empresa com cnpj inválido igual a %s`, (data) => {
    const emp = randomEmpresa();
    emp.cnpj = data;
    expect(() => empresa(get_DB()).insert(emp)).toThrowError();
})
it('não insere uma empresa com cnpj duplicado', () => {
    const empresa1 = randomEmpresa();
    const cnpj_a_duplicar = empresa1.cnpj;
    const empresa2 = randomEmpresa();
    empresa2.cnpj = cnpj_a_duplicar;
    const db = get_DB();
    empresa(db).insert(empresa1)
    expect(() => empresa(db).insert(empresa2)).toThrowError();
})
test.each([
    null,
    undefined,
    simpleFaker.string.numeric(14),
    '00000000000000',
])(`insere empresa com cnpj válido igual a %s`, (data) => {
    const emp = randomEmpresa();
    emp.cnpj = data;
    const result = empresa(get_DB()).insert(emp);
    expect(result).toMatchObject(expectedObject);
})

// nome ///////////////////////////////////////////////////////////////////////
test.each([
    "",
    "       ",
    null,
    undefined
])('não insere empresa com nome inválido igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.nome = data;
    expect(() => empresa(get_DB()).insert(emp)).toThrowError();
})
test.each([
    customFaker.company.name()
])('insere empresa com nome válido igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.nome = data;
    const result = empresa(get_DB()).insert(emp);
    expect(result).toMatchObject(expectedObject);
})

// razao ///////////////////////////////////////////////////////////////////////
test.each([
    "",
    "       ",
])('não insere empresa com razao inválida igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.razao = data;
    expect(() => empresa(get_DB()).insert(emp)).toThrowError();
})
test.each([
    null,
    undefined,
    customFaker.company.catchPhrase()
])('insere empresa com razao válida igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.razao = data;
    const result = empresa(get_DB()).insert(emp);
    expect(result).toMatchObject(expectedObject);
})

// vencimento ///////////////////////////////////////////////////////////////////////
test.each([
    simpleFaker.number.int(),
    simpleFaker.string.alphanumeric(),
    "99/99/9999",
    "2025/06/14",
    "2025-06-14",
    "01/01/0001",
    "00/00/0000",
])('não insere empresa com vencimento inválido igual a %s', (data) => {
    const emp = randomEmpresa();
    expect(() => {
        emp.vencimento = parseDateInput(data);
        empresa(get_DB()).insert(emp);
    }).toThrowError();
})
test.each([
    "",
    null,
    undefined,
    "12/05/2025",
])('insere empresa com vencimento válido igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.vencimento = data? parseDateInput(data) : null;
    const result = empresa(get_DB()).insert(emp);
    expect(result).toMatchObject(expectedObject);
})

// acesso ///////////////////////////////////////////////////////////////////////
test.each([
    "            ",
    "",
])('não insere empresa com acesso inválido igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.acesso = data;
    expect(() => empresa(get_DB()).insert(emp)).toThrowError();
})
test.each([
    null,
    undefined,
    customFaker.internet.email(),
    customFaker.internet.url(),
    simpleFaker.string.alphanumeric(100)
])('insere empresa com acesso válido igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.acesso = data;
    const result = empresa(get_DB()).insert(emp);
    expect(result).toMatchObject(expectedObject);
})

// obs ///////////////////////////////////////////////////////////////////////
test.each([
    "            ",
    "",
])('não insere empresa com obs inválido igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.obs = data;
    expect(() => empresa(get_DB()).insert(emp)).toThrowError();
})
test.each([
    null,
    undefined,
    simpleFaker.string.alphanumeric(100)
])('insere empresa com obs válido igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.acesso = data;
    const result = empresa(get_DB()).insert(emp);
    expect(result).toMatchObject(expectedObject);
})

/* 
📌 Inserção
    📋 id
        ✅ Insere válido.
        ✅ Falha ao inserir inválido.
    📋 cnpj
        ✅ Insere válido.
        ✅ Falha ao inserir inválido.
        ✅ Falha ao inserir duplicado.
    📋 nome
        ✅ Insere válido.
        ✅ Falha ao inserir inválido.
    📋 razao
        ✅ Insere válido.
        ✅ Falha ao inserir inválido.
    📋 vencimento
        ✅ Insere válido.
        ✅ Falha ao inserir inválido.
    📋 acesso
        ✅ Insere válido.
        ✅ Falha ao inserir inválido.
    📋 observações
        ✅ Insere válido.
        ✅ Falha ao inserir inválido.

    ✅ Ignora campos extras não definidos no schema.

📌 Seleção
    Retorna todas as empresas existentes corretamente.
    Retorna empresa por id existente.
    Retorna undefined ou null para id inexistente.

📌 Atualização
    Não afeta nenhuma empresa se o id não existir.
    Falha se passar valores inválidos no update (ex: cnpj vazio).
    Atualiza corretamente uma empresa existente.

📌 Remoção
    Não lança erro ao tentar deletar id inexistente.
    Após exclusão, a empresa realmente desaparece do banco.
    Deleta empresa por id existente.
*/