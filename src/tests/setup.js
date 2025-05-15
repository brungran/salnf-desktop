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

export{
    expect,
    it,
    test,
    simpleFaker,
    customFaker,
    get_DB,
    randomEmpresa,
    parseDateInput
}