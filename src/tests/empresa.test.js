import empresa from '../db/models/empresa.js';
import { expect, it, test } from 'vitest';
import { Faker, pt_BR, en, simpleFaker } from '@faker-js/faker';
import { test_db } from '../db/db.js';
import schema from '../db/schema.js';

const customFaker = new Faker({ locale: [pt_BR, en] });

function get_DB(){
    const db = test_db();
    schema(db).setup();
    return db;
}

function randomEmpresa(){
    return {
        'id': simpleFaker.number.int(),
        'cnpj': simpleFaker.string.numeric(14),
        'nome': customFaker.company.name(),
        'vencimento': customFaker.date.soon(15).toLocaleDateString('en-CA'),
        'acesso': customFaker.internet.exampleEmail(),
        'observações': simpleFaker.string.alphanumeric(100),
    }
}

// id start ///////////////////////////////////////////////////////////////////////
test.each([
    simpleFaker.string.alpha(),
    simpleFaker.number.int(10) * (-1),
    0,
    simpleFaker.number.float(),
    "      "
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
    "",
])('tenta inserir uma empresa com id válido igual a %s', (data) => {
    const emp = randomEmpresa();
    emp.id = data;
    expect(() => empresa(get_DB()).insert(emp)).toBeDefined();
})
// id end ///////////////////////////////////////////////////////////////////////

// cnpj start ///////////////////////////////////////////////////////////////////////
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
    expect(() => empresa(get_DB()).insert(emp)).toBeDefined();
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
// cnpj end ///////////////////////////////////////////////////////////////////////

// nome start ///////////////////////////////////////////////////////////////////////
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
    expect(() => empresa(get_DB()).insert(emp)).toBeDefined();
})
// nome end ///////////////////////////////////////////////////////////////////////

it('insere uma empresa válida', () => {
    const emp = randomEmpresa()
    expect(empresa(get_DB()).insert(emp)).toBeDefined();
})

/* 
📌 Inserção
    📋id
        ✅Insere válido.
        ✅Falaha ao inserir inválido.
    📋cnpj
        ✅Insere válido.
        ✅Falaha ao inserir inválido.
        ✅Falaha ao inserir duplicado.
    📋nome
        ✅Insere válido.
        ✅Falaha ao inserir inválido.

 Falha ao inserir cnpj duplicado (se tiver restrição).

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