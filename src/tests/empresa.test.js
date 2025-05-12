import empresa from '../db/models/empresa.js';
import { expect, it, test } from 'vitest';
import { Faker, pt_BR, en, simpleFaker } from '@faker-js/faker';
import { test_db } from '../db/db.js';
import schema from '../db/schema.js';

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
        'vencimento': customFaker.date.soon(15).toLocaleDateString('en-CA'),
        'acesso': customFaker.internet.exampleEmail(),
        'observações': simpleFaker.string.alphanumeric(100),
    }
}

// id ///////////////////////////////////////////////////////////////////////
test.each([
    simpleFaker.string.alpha(),
    simpleFaker.number.int(10) * (-1),
    0,
    simpleFaker.number.float(),
    "      ",
    "",
])(`tenta inserir uma empresa com id inválido igual a %s`, (data) => {
    const emp = randomEmpresa();
    emp.id = data;
    expect(() => empresa(get_DB()).insert(emp)).toThrowError();
})

test.each([
    simpleFaker.number.int(),
    simpleFaker.string.numeric(),
    null,
    undefined,
])('tenta inserir uma empresa com id válido igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.id = data;
    const result = empresa(get_DB()).insert(emp);
    expect(result).toMatchObject(expectedObject);
})

// cnpj ///////////////////////////////////////////////////////////////////////
test.each([
    simpleFaker.string.alphanumeric(14),
    simpleFaker.string.numeric(13),
    simpleFaker.string.numeric(15),
    Number(simpleFaker.string.numeric(14)) * (-1),
    Number(simpleFaker.string.numeric(13)) * (-1),
    14.002000000701,
    "      "
])(`tenta inserir uma empresa com cnpj inválido igual a %s`, (data) => {
    const emp = randomEmpresa();
    emp.cnpj = data;
    expect(() => empresa(get_DB()).insert(emp)).toThrowError();
})
test.each([
    null,
    undefined,
    simpleFaker.string.numeric(14),
    '00000000000000',
])(`tenta inserir uma empresa com cnpj válido igual a %s`, (data) => {
    const emp = randomEmpresa();
    emp.cnpj = data;
    const result = empresa(get_DB()).insert(emp);
    expect(result).toMatchObject(expectedObject);
})
it('insere uma empresa com cnpj duplicado', () => {
    const empresa1 = randomEmpresa();
    const cnpj_a_duplicar = empresa1.cnpj;
    const empresa2 = randomEmpresa();
    empresa2.cnpj = cnpj_a_duplicar;
    const db = get_DB();
    empresa(db).insert(empresa1)
    expect(() => empresa(db).insert(empresa2)).toThrowError();
})

// nome ///////////////////////////////////////////////////////////////////////
test.each([
    "",
    "       ",
    null,
    undefined
])('tenta inserir uma empresa com nome inválido igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.nome = data;
    expect(() => empresa(get_DB()).insert(emp)).toThrowError();
})
test.each([
    customFaker.company.name()
])('tenta inserir uma empresa com nome válido igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.nome = data;
    const result = empresa(get_DB()).insert(emp);
    expect(result).toMatchObject(expectedObject);
})

// razao ///////////////////////////////////////////////////////////////////////
test.each([
    "",
    "       ",
    null,
    undefined,
    customFaker.company.catchPhrase()
])('tenta inserir uma empresa com razao válida igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.razao = data;
    const result = empresa(get_DB()).insert(emp);
    expect(result).toMatchObject(expectedObject);
})

// vencimento ///////////////////////////////////////////////////////////////////////
test.only.each([
    simpleFaker.number.int(),
    simpleFaker.string.alphanumeric(),
    "99/99/9999",
    "2025/06/14",
    "2025-06-14",
])('tenta inserir uma empresa com vencimento inválido igual a %s', (data) => {
    function br_date_to_sql_date(input) {
        console.log(typeof(input))
        if(input !== "" && input !== null && input !== undefined && typeof(input) === typeof('string') && input.includes('/')){
            const [dia, mes, ano] = input.split('/')
            return `${ano.padStart(4, '0')}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        }
    }
    
    const emp = randomEmpresa();
    emp.vencimento = br_date_to_sql_date(data);
    expect(() => empresa(get_DB()).insert(emp)).toThrowError();
})
test.each([
    "",
    "12/05/2025",
])('tenta inserir uma empresa com vencimento válido igual a %s', (data) => {
    function br_date_to_sql_date(input) {
        if(input != ""){
            const [dia, mes, ano] = input.split('/');
            return `${ano.padStart(4, '0')}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        }
    }
    
    const emp = randomEmpresa();
    emp.vencimento = br_date_to_sql_date(data);
    const result = empresa(get_DB()).insert(emp);
    expect(result).toMatchObject(expectedObject);
})

// empresa inteira ///////////////////////////////////////////////////////////////////////
it('insere uma empresa válida', () => {
    const emp = randomEmpresa()
    const result = empresa(get_DB()).insert(emp)
    expect(result).toMatchObject(expectedObject);
})

/* 
📌Inserção
    📋id
        ✅Insere válido.
        ✅Falha ao inserir inválido.
    📋cnpj
        ✅Insere válido.
        ✅Falha ao inserir inválido.
        ✅Falha ao inserir duplicado.
    📋nome
        ✅Insere válido.
        ✅Falha ao inserir inválido.
    📋razao
        Insere válido.
        Falha ao inserir inválido.
    📋vencimento
        Insere válido.
        Falha ao inserir inválido.
    📋acesso
        Insere válido.
        Falha ao inserir inválido.
    📋observações
        Insere válido.
        Falha ao inserir inválido.

 Ignora campos extras não definidos no schema.

📌 Seleção (select / all)
 Retorna todas as empresas existentes corretamente.

 Retorna empresa por id existente.

 Retorna undefined ou null para id inexistente.

📌 Atualização (update)
 Atualiza corretamente uma empresa existente.

 Não afeta nenhuma empresa se o id não existir.

 Falha se passar valores inválidos no update (ex: cnpj vazio).

📌 Remoção (delete)
 Deleta empresa por id existente.

 Não lança erro ao tentar deletar id inexistente.

 Após exclusão, a empresa realmente desaparece do banco.

 ✅Insere uma empresa válida.
*/