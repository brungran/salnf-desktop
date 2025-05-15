import { describe } from 'vitest';
import empresa from '../../db/models/empresa.js';
import {
    expect,
    it,
    test,
    simpleFaker,
    customFaker,
    get_DB,
    randomEmpresa,
    parseDateInput
} from '../setup.js';

const success = {changes: 1}

describe('Empresa', () =>{
    describe('Insere', () =>{
        describe('id', () =>{
            test.each([
                simpleFaker.number.int({min: 1}),
                simpleFaker.string.numeric(),
                null,
                undefined,
            ])('igual a %s', (data) => {
                const emp = randomEmpresa();
                emp.id = data;
                const result = empresa(get_DB()).insert(emp);
                expect(result).toMatchObject(success);
            })
        })
        describe('cnpj', () =>{
            test.each([
                null,
                undefined,
                simpleFaker.string.numeric(14),
                '00000000000000',
            ])(`igual a %s`, (data) => {
                const emp = randomEmpresa();
                emp.cnpj = data;
                const result = empresa(get_DB()).insert(emp);
                expect(result).toMatchObject(success);
            })
        })
        describe('nome', () =>{
            test.each([
                customFaker.company.name()
            ])('igual a %s', (data) => {
                const emp = randomEmpresa();
                emp.nome = data;
                const result = empresa(get_DB()).insert(emp);
                expect(result).toMatchObject(success);
            })
        })
        describe('razao', () =>{
            test.each([
                null,
                undefined,
                customFaker.company.catchPhrase()
            ])('igual a %s', (data) => {
                const emp = randomEmpresa();
                emp.razao = data;
                const result = empresa(get_DB()).insert(emp);
                expect(result).toMatchObject(success);
            })
        })
        describe('vencimento', () =>{
            test.each([
                "",
                null,
                undefined,
                "12/05/2025",
            ])('igual a %s', (data) => {
                const emp = randomEmpresa();
                emp.vencimento = data? parseDateInput(data) : null;
                const result = empresa(get_DB()).insert(emp);
                expect(result).toMatchObject(success);
            })
        })
        describe('acesso', () =>{
            test.each([
                null,
                undefined,
                customFaker.internet.email(),
                customFaker.internet.url(),
                simpleFaker.string.alphanumeric(100)
            ])('igual a %s', (data) => {
                const emp = randomEmpresa();
                emp.acesso = data;
                const result = empresa(get_DB()).insert(emp);
                expect(result).toMatchObject(success);
            })
        })
        describe('obs', () =>{
            test.each([
                null,
                undefined,
                simpleFaker.string.alphanumeric(100)
            ])('igual a %s', (data) => {
                const emp = randomEmpresa();
                emp.acesso = data;
                const result = empresa(get_DB()).insert(emp);
                expect(result).toMatchObject(success);
            })
        })
    })
    describe('Não insere', () =>{
        test('Campo inexistente na tabela', () => {
            const emp = randomEmpresa();
            emp.endereço = customFaker.location.streetAddress();
            expect(() => empresa(get_DB()).insert(emp)).toThrowError();
        })
        describe('id', () =>{
            test.each([
                simpleFaker.string.alpha(),
                simpleFaker.number.int(10) * (-1),
                0,
                simpleFaker.number.float(),
                "      ",
                "",
            ])(`igual a %s`, (data) => {
                const emp = randomEmpresa();
                emp.id = data;
                expect(() => empresa(get_DB()).insert(emp)).toThrowError();
            })
        })
        describe('cnpj', () =>{
            test.each([
                simpleFaker.string.alphanumeric(14),
                simpleFaker.string.numeric(13),
                simpleFaker.string.numeric(15),
                Number(simpleFaker.string.numeric(14)) * (-1),
                Number(simpleFaker.string.numeric(13)) * (-1),
                14.002000000701,
                "      ",
                ''
            ])(`igual a %s`, (data) => {
                const emp = randomEmpresa();
                emp.cnpj = data;
                expect(() => empresa(get_DB()).insert(emp)).toThrowError();
            }),

            it('duplicado', () => {
                const empresa1 = randomEmpresa();
                const cnpj_a_duplicar = empresa1.cnpj;
                const empresa2 = randomEmpresa();
                empresa2.cnpj = cnpj_a_duplicar;
                const db = get_DB();
                empresa(db).insert(empresa1)
                expect(() => empresa(db).insert(empresa2)).toThrowError();
            })
        })
        describe('nome', () =>{
            test.each([
                "",
                "       ",
                null,
                undefined
            ])('igual a %s', (data) => {
                const emp = randomEmpresa();
                emp.nome = data;
                expect(() => empresa(get_DB()).insert(emp)).toThrowError();
            })
        })
        describe('razao', () =>{
            test.each([
                "",
                "       ",
            ])('igual a %s', (data) => {
                const emp = randomEmpresa();
                emp.razao = data;
                expect(() => empresa(get_DB()).insert(emp)).toThrowError();
            })
        })
        describe('vencimento', () =>{
            test.each([
                simpleFaker.number.int(),
                simpleFaker.string.alphanumeric(),
                "99/99/9999",
                "2025/06/14",
                "2025-06-14",
                "01/01/0001",
                "00/00/0000",
            ])('igual a %s', (data) => {
                const emp = randomEmpresa();
                expect(() => {
                    emp.vencimento = parseDateInput(data);
                    empresa(get_DB()).insert(emp);
                }).toThrowError();
            })
        })
        describe('acesso', () =>{
            test.each([
                "            ",
                "",
            ])('igual a %s', (data) => {
                const emp = randomEmpresa();
                emp.acesso = data;
                expect(() => empresa(get_DB()).insert(emp)).toThrowError();
            })
        })
        describe('obs', () =>{
            test.each([
                "            ",
                "",
            ])('igual a %s', (data) => {
                const emp = randomEmpresa();
                emp.obs = data;
                expect(() => empresa(get_DB()).insert(emp)).toThrowError();
            })
        })
    })
})