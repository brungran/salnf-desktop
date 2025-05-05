import empresa from '../db/models/empresa.js';
import { expect, it } from 'vitest';
import { Faker, pt_BR, en, simpleFaker } from '@faker-js/faker';
import { test_db } from '../db/db.js';
import schema from '../db/schema.js';

const customFaker = new Faker({ locale: [pt_BR, en] });

function randomEmpresa(){
    return {
        'id': 14,
        'nome': customFaker.company.name(),
        'vencimento': customFaker.date.soon(15).toLocaleDateString('en-CA'),
        'acesso': customFaker.internet.exampleEmail(),
        'observações': simpleFaker.string.alpha(100),
    }
}

it('insere uma empresa válida', () => {
    const db = test_db();
    schema(db).setup();
    expect(empresa(db).insert(randomEmpresa())).toBeDefined();
})
it('tenta inserir uma empresa com nome nulo', () => {
    const db = test_db();
    schema(db).setup();
    expect(() => empresa(db).insert(randomEmpresa().nome = null)).toThrowError();
})
it('tenta inserir uma empresa com nome vazio', () => {
    const db = test_db();
    schema(db).setup();
    expect(() => empresa(db).insert(randomEmpresa().nome = '')).toThrowError();
})
it('tenta inserir uma empresa com espaços em branco no nome', () => {
    const db = test_db();
    schema(db).setup();
    expect(() => empresa(db).insert(randomEmpresa().nome = '         ')).toThrowError();
})

/* 
📌 Inserção (insert)
 ✅Insere uma empresa válida.

 ✅Falha ao inserir empresa com nome nulo ou undefined.
 ✅Falha ao inserir empresa com nome vazio.
 ✅Falha ao inserir empresa com nome sendo somente espaços em branco.

 Falha ao inserir com id inválido (ex: string, float, negativo).

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
*/