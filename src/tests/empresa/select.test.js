import { describe } from 'vitest';
import empresa from '../../db/models/empresa.js';
import {
    expect,
    it,
    simpleFaker,
    customFaker,
    get_DB,
    randomEmpresa,
} from '../setup.js';

describe('Empresa', () => {
    describe('Busca', () => {
        it("todas", () => {
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
        it("campos com condições", () => {
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
    })
    describe('Não busca', () => {
        it("nenhum registro com valor igual da cláusula where", () => {
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
        it("colunas inexistentes na tabela", () => {
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
        it("colunas da cláusula where inexistentes na tabela", () => {
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
    })    
})