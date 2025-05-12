import path from 'node:path';
import Database from 'better-sqlite3';

function add_functions_to_db(db){
  db.function('regexp', (pattern, value) => {
      try {
          const re = new RegExp(pattern, "g");
          if (re.test(value)) return 1;
      } catch {
          return 0;
      }
  });

  db.function('is_valid_date', (value) => {
    if (typeof value !== 'string') return 0;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return 0;

    const [_, year, month, day] = match.map(Number);
    const date = new Date(`${year}-${month}-${day}`);

    // Confere se o date criado ainda tem os mesmos valores
    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    ) ? 1 : 0;
  });
}

function setup(db) {
  db.pragma('journal_mode = WAL');
  add_functions_to_db(db);
  return db;
}

const production_db = setup(new Database(path.resolve('src/database.db')));

const test_db = () => setup(new Database(':memory:'));

export default production_db;
export { production_db, test_db };