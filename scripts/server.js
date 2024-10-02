const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3002;

app.use(cors());

const API_CHAVE = 'a8882e2d8cf24f5492df823d1d92ffe2';
const URL = 'https://api.football-data.org/v4/';

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
            crest: team.crest, 
            address: team.address,
            website: team.website,
            founded: team.founded,
            clubColors: team.clubColors,
            venue: team.venue,
            runningCompetitions: team.runningCompetitions
        }));

        return timesComLogos; // Retorne o array de times com logos após o mapeamento
    } catch (error) {
        console.error('Erro ao buscar times da liga:', error.message);
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

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
