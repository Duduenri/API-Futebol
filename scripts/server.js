const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Para permitir requisições de outros domínios (no caso, o front-end)

const app = express();
const PORT = 3002; //http://localhost:3002/ligas
const API_CHAVE = 'a8882e2d8cf24f5492df823d1d92ffe2';
const URL = 'https://api.football-data.org/v4/';

// Habilita CORS para aceitar requisições do front-end
app.use(cors());

// Rota que busca ligas
app.get('/ligas', async (req, res) => {
    try {
        const resposta = await axios.get(`${URL}competitions`, {
            headers: { 'X-Auth-Token': API_CHAVE }
        });
        const ligas = resposta.data.competitions.filter(comp => comp.type === 'LEAGUE' && comp.plan === 'TIER_ONE');
        res.json(ligas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao acessar a API de football-data' });
    }
});

// Rota para buscar os times de uma liga específica
app.get('/ligas/:ligaId/times', async (req, res) => {
    const ligaId = req.params.ligaId;
    try {
        const resposta = await axios.get(`${URL}competitions/${ligaId}/teams`, {
            headers: { 'X-Auth-Token': API_CHAVE }
        });
        res.json(resposta.data.teams);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao acessar a API de football-data' });
    }
});

// Rota para buscar as próximas partidas de um time
app.get('/times/:timeId/proximas-partidas', async (req, res) => {
    const timeId = req.params.timeId;
    try {
        const resposta = await axios.get(`${URL}teams/${timeId}/matches?status=SCHEDULED&limit=5`, {
            headers: { 'X-Auth-Token': API_CHAVE }
        });
        res.json(resposta.data.matches);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao acessar a API de football-data' });
    }
});

// Rota para buscar as últimas partidas de um time
app.get('/times/:timeId/ultimas-partidas', async (req, res) => {
    const timeId = req.params.timeId;
    try {
        const resposta = await axios.get(`${URL}teams/${timeId}/matches?status=FINISHED&limit=5`, {
            headers: { 'X-Auth-Token': API_CHAVE }
        });
        res.json(resposta.data.matches);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao acessar a API de football-data' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
