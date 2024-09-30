const axios = require('axios'); //Axios é uma biblioteca para fazer requisição http
const prompt = require('prompt-sync')();
const cors = require('cors');

const app = express();
const PORT = 3002; // Escolha uma porta para o back-end

// Chave da API
const API_CHAVE = 'a8882e2d8cf24f5492df823d1d92ffe2';
const URL = 'https://api.football-data.org/v4/';

app.use(cors());

async function mostrarLigas() { //async para funções assincronas
    const url = `${URL}competitions`;
    const headers = {
        'X-Auth-Token': API_CHAVE
    };
    
    try {
        const resposta = await axios.get(url, { headers });
        const competicoes = resposta.data.competitions;
        const ligas = competicoes.filter(comp => comp.type === 'LEAGUE' && comp.plan === 'TIER_ONE');
        return ligas;
    } catch (error) {
        console.error(`Erro ao acessar a API: ${error.resposta ? error.resposta.status : error.message}`);
        return null;
    }
}


async function selecionarLiga() {
    const ligas = await mostrarLigas(); //await é para esperar a resolução de uma promessa no codigo para q ele seja executado
    if (!ligas) return null; // ! é um operador! ele innverte o valor booleano de uma expressão

    console.log("Ligas disponíveis:");
    ligas.forEach((liga, index) => {
        console.log(`${index + 1}: ${liga.name} (${liga.code})`);
    });

    const escolha = parseInt(prompt("\nSelecione o número da liga: ")) - 1; //parseInt converte uma string em um numero inteiro
    if (0 <= escolha && escolha < ligas.length) { //porque utiliza escolha 2x? ele armazena a entrada do usuario convertida e ajustada e verifica se a entrada é valida
        return ligas[escolha].id;
    } else {
        console.log("Opção inválida.");
        return null;
    }
}


async function timesPorLiga(ligaId) {
    const url = `${URL}competitions/${ligaId}/teams`;
    const headers = {
        'X-Auth-Token': API_CHAVE
    };
    
    try {
        const response = await axios.get(url, { headers });
        return response.data.teams;
    } catch (error) {
        console.error(`Erro ao acessar a API: ${error.response ? error.response.status : error.message}`);
        return null;
    }
}

function pegarIdTime(nomeTime, times) {
    const timeEncontrado = times.find(time => time.name.toLowerCase().includes(nomeTime.toLowerCase()));
    if (timeEncontrado) {
        return timeEncontrado.id;
    } else {
        console.log(`Time "${nomeTime}" não encontrado.`);
        return null;
    }
}

async function proximasCincoPartidas(timeId) {
    const url = `${URL}teams/${timeId}/matches?status=SCHEDULED&limit=5`;
    const headers = {
        'X-Auth-Token': API_CHAVE
    };
    
    try {
        const response = await axios.get(url, { headers });
        return response.data.matches;
    } catch (error) {
        console.error(`Erro ao acessar a API: ${error.response ? error.response.status : error.message}`);
        return null;
    }
}

async function ultimasCincoPartidas(timeId) {
    const url = `${URL}teams/${timeId}/matches?status=FINISHED&limit=5`;
    const headers = {
        'X-Auth-Token': API_CHAVE
    };
    
    try {
        const response = await axios.get(url, { headers });
        return response.data.matches;
    } catch (error) {
        console.error(`Erro ao acessar a API: ${error.response ? error.response.status : error.message}`);
        return null;
    }
}

async function pesquisarTimeEMostrarPartidas(nomeTime, idLiga) {
    const times = await timesPorLiga(idLiga);
    if (!times) return null;

    const idTime = pegarIdTime(nomeTime, times);
    if (idTime) {
        console.log(`\nPróximos 5 jogos do ${nomeTime}:`);
        const proximasPartidas = await proximasCincoPartidas(idTime);
        if (proximasPartidas) {
            proximasPartidas.forEach(partida => {
                console.log(`${partida.utcDate} - ${partida.homeTeam.name} vs ${partida.awayTeam.name}`);
            });
        }

        console.log(`\nÚltimos 5 jogos do ${nomeTime}:`);
        const ultimasPartidas = await ultimasCincoPartidas(idTime);
        if (ultimasPartidas) {
            ultimasPartidas.forEach(partida => {
                console.log(`${partida.utcDate} - ${partida.homeTeam.name} ${partida.score.fullTime.home} x ${partida.score.fullTime.away} ${partida.awayTeam.name}`);
            });
        }
    }
}

(async () => { //define uma função ASSINCORNA que é executada 
    const ligaId = await selecionarLiga();
    if (ligaId) {
        const nomeTime = prompt("\nDigite o nome do time: ");
        await pesquisarTimeEMostrarPartidas(nomeTime, ligaId);
    }
})();
