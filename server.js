const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static('public'));

// Array para armazenar os leads na memória (temporário)
const leads = [];

// Rota para receber dados do formulário
app.post('/api/leads', (req, res) => {
    try {
        const lead = {
            id: Date.now(),
            nome: req.body.nome,
            email: req.body.email,
            whatsapp: req.body.whatsapp,
            profissao: req.body.profissao,
            prazo: req.body.prazo,
            data: new Date().toISOString()
        };
        
        // Adiciona o lead ao array
        leads.push(lead);
        
        console.log('✅ Novo lead cadastrado:');
        console.log('Nome:', lead.nome);
        console.log('Email:', lead.email);
        console.log('WhatsApp:', lead.whatsapp);
        console.log('Profissão:', lead.profissao);
        console.log('Prazo:', lead.prazo);
        console.log('----------------------------');
        
        res.json({ 
            sucesso: true, 
            mensagem: 'Lead cadastrado com sucesso!',
            id: lead.id
        });
        
    } catch (error) {
        console.error('❌ Erro ao cadastrar lead:', error);
        res.status(500).json({ 
            sucesso: false, 
            mensagem: 'Erro ao cadastrar lead' 
        });
    }
});

// Rota para listar todos os leads (útil para visualizar)
app.get('/api/leads', (req, res) => {
    res.json({
        total: leads.length,
        leads: leads
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📄 Acesse a landing page: http://localhost:${PORT}/landing.html`);
    console.log(`📊 Ver leads cadastrados: http://localhost:${PORT}/api/leads`);
});