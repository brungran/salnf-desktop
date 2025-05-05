import path from 'node:path';
import Database from 'better-sqlite3';

function applyPragmas(db) {
  db.pragma('journal_mode = WAL');
  return db;
}

const production_db = applyPragmas(new Database(path.resolve('src/database.db')));

const test_db = () => applyPragmas(new Database(':memory:'));

export default production_db;
export { production_db, test_db };