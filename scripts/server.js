const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3002;

app.use(cors());

const API_CHAVE = 'a8882e2d8cf24f5492df823d1d92ffe2';
const URL = 'https://api.football-data.org/v4/';

// Função para obter os times de uma liga
const timesPorLiga = async (ligaId) => {
    try {
        const response = await axios.get(`${URL}competitions/${ligaId}/teams`, {
            headers: { 'X-Auth-Token': API_CHAVE }
        });

        // Mapear os times e adicionar o campo 'crest' para o logo
        const timesComLogos = response.data.teams.map(team => ({
            id: team.id,
            name: team.name,
            shortName: team.shortName,
            tla: team.tla,
            crest: team.crest, // Adiciona o logo do time
            address: team.address,
            website: team.website,
            founded: team.founded,
            clubColors: team.clubColors,
            venue: team.venue,
            runningCompetitions: team.runningCompetitions
        }));

        return timesComLogos;
    } catch (error) {
        console.error('Erro ao buscar times da liga:', error.message);
        return null;
    }
};

// Função para buscar as próximas partidas de um time
const proximasPartidasPorTime = async (timeId) => {
    try {
        const response = await axios.get(`${URL}teams/${timeId}/matches?status=SCHEDULED`, {
            headers: { 'X-Auth-Token': API_CHAVE }
        });

        // Filtra e pega as próximas 5 partidas
        const proximasPartidas = response.data.matches.slice(0, 5);

        return proximasPartidas;
    } catch (error) {
        console.error('Erro ao buscar próximas partidas:', error.message);
        return null;
    }
};

// Função para buscar as últimas partidas de um time
const ultimasPartidasPorTime = async (timeId) => {
    try {
        const response = await axios.get(`${URL}teams/${timeId}/matches?status=FINISHED`, {
            headers: { 'X-Auth-Token': API_CHAVE }
        });

        // Filtra e pega as últimas 5 partidas
        const ultimasPartidas = response.data.matches.slice(-5);

        return ultimasPartidas;
    } catch (error) {
        console.error('Erro ao buscar últimas partidas:', error.message);
        return null;
    }
};

// Rota para obter ligas
app.get('/ligas', async (req, res) => {
    try {
        const response = await axios.get(`${URL}competitions`, {
            headers: { 'X-Auth-Token': API_CHAVE }
        });
        const ligas = response.data.competitions.filter(comp => comp.type === 'LEAGUE' && comp.plan === 'TIER_ONE');
        res.json(ligas);
    } catch (error) {
        console.error('Erro ao acessar a API:', error.message);
        res.status(500).send('Erro ao acessar a API');
    }
});

// Rota para obter times de uma liga específica
app.get('/ligas/:ligaId/times', async (req, res) => {
    const ligaId = req.params.ligaId;

    try {
        const times = await timesPorLiga(ligaId);
        if (times) {
            res.json(times);
        } else {
            res.status(404).json({ message: 'Times não encontrados para esta liga' });
        }
    } catch (error) {
        console.error('Erro ao buscar times:', error);
        res.status(500).json({ message: 'Erro ao buscar times' });
    }
});

// Função para buscar as próximas 5 partidas agendadas
async function proximasCincoPartidas(timeId) {
    const url = `${URL}teams/${timeId}/matches?status=SCHEDULED&limit=5`;
    const headers = { 'X-Auth-Token': API_CHAVE };

    try {
        const response = await axios.get(url, { headers });
        return response.data.matches;
    } catch (error) {
        console.error(`Erro ao acessar a API: ${error.response ? error.response.status : error.message}`);
        return null;
    }
}

// Função para buscar as últimas 5 partidas finalizadas
async function ultimasCincoPartidas(timeId) {
    const url = `${URL}teams/${timeId}/matches?status=FINISHED&limit=5`;
    const headers = { 'X-Auth-Token': API_CHAVE };

    try {
        const response = await axios.get(url, { headers });
        return response.data.matches;
    } catch (error) {
        console.error(`Erro ao acessar a API: ${error.response ? error.response.status : error.message}`);
        return null;
    }
}

// Rota para obter as próximas 5 e as últimas 5 partidas de um time
app.get('/times/:timeId/partidas', async (req, res) => {
    const timeId = req.params.timeId;

    try {
        const proximasPartidas = await proximasCincoPartidas(timeId);
        const ultimasPartidas = await ultimasCincoPartidas(timeId);

        if (proximasPartidas && ultimasPartidas) {
            res.json({ proximas: proximasPartidas, ultimas: ultimasPartidas });
        } else {
            res.status(404).json({ message: 'Partidas não encontradas para este time' });
        }
    } catch (error) {
        console.error('Erro ao buscar partidas:', error);
        res.status(500).json({ message: 'Erro ao buscar partidas' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
