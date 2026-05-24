const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Credenciais de admin (TROCAR EM PRODUÇÃO!)
const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'senha123';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Caminho do arquivo de leads
const LEADS_FILE = path.join(__dirname, 'leads.json');

// Função para ler leads
async function readLeads() {
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Função para salvar leads
async function saveLeads(leads) {
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
}

// API - Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    res.json({ 
      success: true, 
      message: 'Login realizado com sucesso!' 
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Usuário ou senha incorretos' 
    });
  }
});

// API - Salvar novo lead
app.post('/api/leads', async (req, res) => {
  try {
    const newLead = {
      ...req.body,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    const leads = await readLeads();
    leads.push(newLead);
    await saveLeads(leads);

    res.json({ success: true, message: 'Lead salvo com sucesso!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao salvar lead' });
  }
});

// API - Listar todos os leads
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await readLeads();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar leads' });
  }
});

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});