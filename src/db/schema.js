export default function schema(db){
    return{
        setup(){
            db.prepare(`
                CREATE TABLE IF NOT EXISTS empresas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT CHECK(id > 0),
                    cnpj TEXT UNIQUE CHECK(cnpj IS NULL OR regexp('^[0-9]{14}$', cnpj)) DEFAULT NULL,
                    nome TEXT NOT NULL CHECK(LENGTH(TRIM(nome)) > 0),
                    razao TEXT CHECK(razao IS NULL OR LENGTH(TRIM(razao)) > 0) DEFAULT NULL,
                    vencimento TEXT DEFAULT (date('now', '+7 days')) CHECK (vencimento IS NULL OR is_valid_date(vencimento)),
                    acesso TEXT CHECK(acesso IS NULL OR LENGTH(TRIM(acesso)) > 0) DEFAULT NULL,
                    obs TEXT CHECK(obs IS NULL OR LENGTH(TRIM(obs)) > 0) DEFAULT NULL
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