export default function empresa(db){
  return {
    validate(data, [ operation = "", clause = "" ]) {
      const validFields = ['id', 'nome', 'vencimento', 'acesso', 'observações'];
    
      if (data.length === 0) {
        throw new Error([
          'Nenhum dado fornecido.',
          operation && `Operação: ${operation}`,
          clause && `Cláusula: ${clause}`,
        ].filter(Boolean).join('\n'));
      }
    
      for (const key of Object.keys(data)) {
        if (!validFields.includes(key)) {
          throw new Error([
            `Campo inválido: ${key}`,
            operation && `Operação: ${operation}`,
            clause && `Cláusula: ${clause}`,
            `Composição do objeto:`
            `Chaves - ${Object.keys(data)}`,
            `valores - ${Object.values(data)}`,
          ].filter(Boolean).join('\n'));
        }
      }
    
      return true;
    },
    
    insert(data) {
      const dataFields = Object.keys(data);
    
      const fields = dataFields.join(', ');
      const placeholders = dataFields.map(() => '?').join(', ');
      const query = `INSERT INTO empresas (${fields}) VALUES (${placeholders})`;
    
      const stmt = db.prepare(query);
      return stmt.run(Object.values(data));
    },
    
    all(){
      return db.prepare("SELECT * FROM empresas").all();
    },
    
    select(selectFields, where) {
      const whereFields = Object.keys(where);
      
      selectFields = selectFields.join(', ');
      const wherePlaceHolders = whereFields.map(key => `${key} = ?`).join(' AND ');
      const query = `SELECT ${selectFields} FROM empresas WHERE ${wherePlaceHolders}`;
    
      const stmt = db.prepare(query.replace(/\bnome\s*=/i, 'nome LIKE'));
      return stmt.all(Object.values(where));
    },
    
    update(data, where) {
      const dataFields = Object.keys(data)
      const whereFields = Object.keys(where)
    
      const setPlaceholders = dataFields.map(field => `${field} = ?`).join(', ');
      const wherePlaceholders = whereFields.map(field => `${field} = ?`).join(' AND ');
      const query = `UPDATE empresas SET ${setPlaceholders} WHERE ${wherePlaceholders}`;
    
      const stmt = db.prepare(query);
      return stmt.run(Object.values(data), Object.values(where));
    },
    
    remove(where) {
      const whereFields = Object.keys(where)
    
      const placeHolders = whereFields.map(field => `${field} = ?`).join(' AND ');
      const query = `DELETE FROM empresas WHERE ${placeHolders}`;
    
      const stmt = db.prepare(query);
      return stmt.run(Object.values(where));
    }
  };
}