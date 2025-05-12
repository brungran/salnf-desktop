export default function schema(db){
    return{
        setup(){
            // cnpj TEXT UNIQUE CHECK (LENGTH(cnpj) = 14 AND cnpj GLOB '[0-9]*'),
            db.prepare(`
                CREATE TABLE IF NOT EXISTS empresas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT CHECK(id > 0),
                    cnpj TEXT UNIQUE NOT NULL CHECK (regexp('^[0-9]{14}$', cnpj)),
                    nome TEXT NOT NULL CHECK (LENGTH(TRIM(nome)) > 0),
                    razao TEXT CHECK (LENGTH(TRIM(razao)) >= 0) DEFAULT NULL,
                    vencimento TEXT DEFAULT (date('now', '+7 days')) CHECK (vencimento IS NULL OR is_valid_date(vencimento)),
                    acesso TEXT,
                    observações TEXT
                )
            `).run();
            return true;
        }
    }
}

/*
    * = Tem que ser igual no sistema corporativo, portanto pode ser nulo e/ou editável
    TODO filiais
        id *
        nome
    DONE empresas
        id
        nome
        vencimento
        acesso
        observações
    TODO credenciais
        id
        empresa
        filial
        login
        senha
    TODO serviços
        id
        nome
        tipo de lançamento
        centro de custo
        contas
        empresa (cnpj e razao)
    TODO autorizantes
        id *
        nome
    TODO tipos de lançamento
        id *
        nome
    TODO centros de custo
        id *
        nome
    TODO contas
        id *
        nome
    TODO lançamentos
        id *
        data
        filial
        referência
        autorizante
        vlr bruto
        vlr desconto
        vlr acréscimo
        vlr final
        vlr_conta
        vlr_lançamento
        fatura
        nota_fiscal
        boleto
        emissão
        vencimento
        empresa (cnpj e razao)
        centro de custo
        conta
        status
        observações
*/  