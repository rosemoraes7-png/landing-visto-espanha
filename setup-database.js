const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./leads.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT,
      empresa TEXT,
      mensagem TEXT,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Banco de dados criado com sucesso!');
});

db.close();