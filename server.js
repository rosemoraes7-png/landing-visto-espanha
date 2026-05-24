const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'otimizzai-visto-espanha-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Conectar ao banco de dados
const db = new sqlite3.Database('./leads.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite');
  }
});

// Rotas principais
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/landing.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// API - Salvar lead
app.post('/api/leads', (req, res) => {
  const { nome, email, whatsapp, cidade, formacao, objetivo, outros_objetivos } = req.body;
  
  const sql = `INSERT INTO leads (nome, email, whatsapp, cidade, formacao, objetivo, outros_objetivos) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [nome, email, whatsapp, cidade, formacao, objetivo, outros_objetivos], function(err) {
    if (err) {
      console.error('Erro ao salvar lead:', err);
      return res.status(500).json({ error: 'Erro ao salvar lead' });
    }
    res.json({ success: true, id: this.lastID });
  });
});

// API - Buscar todos os leads
app.get('/api/leads', (req, res) => {
  const sql = 'SELECT * FROM leads ORDER BY created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar leads:', err);
      return res.status(500).json({ error: 'Erro ao buscar leads' });
    }
    res.json(rows);
  });
});

// API - Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'otimizzai2025') {
    req.session.authenticated = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// API - Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});