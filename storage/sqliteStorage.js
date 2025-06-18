const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'scores.db');
const db = new Database(dbPath, { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    score INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);


function saveScore(score) {
  try {
    const stmt = db.prepare('INSERT INTO scores (score) VALUES (?)');
    const info = stmt.run(score);
    console.log('Skóre bylo uloženo do SQLite.');
    return { success: true, id: info.lastInsertRowid };
  } catch (error) {
    console.error('Chyba při ukládání skóre do SQLite:', error);
    return { success: false, error: error.mesage };
  }
}

/** Funkce pro získání nejvyšších skóre */
function getTopScores(limit = 10) {
  const stmt = db.prepare('SELECT * FROM scores ORDER BY score DESC LIMIT ?');
  return stmt.all(limit);
}

/** Export funkce */
module.exports = {
  saveScore,
  getTopScores
};