import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Ligas = () => {
  const [ligas, setLigas] = useState([]);
  const [times, setTimes] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [ligaSelecionada, setLigaSelecionada] = useState(null);
  const [timeSelecionado, setTimeSelecionado] = useState('');

  useEffect(() => {
    const fetchLigas = async () => {
      try {
        const response = await axios.get('http://localhost:3002/ligas');
        setLigas(response.data);
      } catch (error) {
        console.error('Erro ao buscar ligas:', error);
      }
    };

    fetchLigas();
  }, []);

  const handleLigaChange = async (event) => {
    const ligaId = event.target.value;
    setLigaSelecionada(ligaId);

    try {
      const response = await axios.get(`http://localhost:3002/ligas/${ligaId}/times`);
      setTimes(response.data);
    } catch (error) {
      console.error('Erro ao buscar times:', error);
    }
  };

  const handleTimeChange = async (event) => {
    const timeId = event.target.value;

    try {
      const response = await axios.get(`http://localhost:3002/times/${timeId}/partidas`);
      setPartidas(response.data);
    } catch (error) {
      console.error('Erro ao buscar partidas:', error);
    }
  };

  return (
    <div>
      <h1>Ligas Disponíveis</h1>
      <select onChange={handleLigaChange}>
        <option value="">Selecione uma liga</option>
        {ligas.map((liga) => (
          <option key={liga.id} value={liga.id}>
            {liga.name} ({liga.code})
          </option>
        ))}
      </select>

      {ligaSelecionada && (
        <div>
          <h2>Times Disponíveis</h2>
          <select onChange={handleTimeChange}>
            <option value="">Selecione um time</option>
            {times.map((time) => (
              <option key={time.id} value={time.id}>
                {time.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {partidas.proximas && (
        <div>
          <h2>Próximas 5 Partidas:</h2>
          <ul>
            {partidas.proximas.map((partida) => (
              <li key={partida.id}>
                {partida.utcDate} - {partida.homeTeam.name} vs {partida.awayTeam.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {partidas.ultimas && (
        <div>
          <h2>Últimas 5 Partidas:</h2>
          <ul>
            {partidas.ultimas.map((partida) => (
              <li key={partida.id}>
                {partida.utcDate} - {partida.homeTeam.name} {partida.score.fullTime.home} x {partida.score.fullTime.away} {partida.awayTeam.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Ligas;
