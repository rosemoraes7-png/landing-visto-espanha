require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // ← IMPORTANTE: permite receber JSON

// "Banco de dados" temporário (em memória)
let leads = [];

// Rota: Página de Login
app.get('/', (req, res) => {
    res.sendFile(path.resolve('views/login.html'));
});

// Rota: Autenticação
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    
    if (usuario === process.env.USER && senha === process.env.PASS) {
        res.sendFile(path.resolve('views/dashboard.html'));
    } else {
        res.send('<h2>Login inválido. <a href="/">Tente novamente</a></h2>');
    }
});

// ✨ NOVA ROTA: Receber leads do formulário
app.post('/api/leads', (req, res) => {
    const novoLead = {
        id: Date.now(),
        dataHora: new Date().toLocaleString('pt-BR'),
        ...req.body
    };
    
    leads.push(novoLead);
    
    console.log('✅ Novo lead recebido:', novoLead);
    
    res.json({ 
        success: true, 
        message: 'Lead registrado com sucesso!',
        lead: novoLead
    });
});

// ✨ NOVA ROTA: Listar todos os leads (para o dashboard)
app.get('/api/leads', (req, res) => {
    res.json(leads);
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});