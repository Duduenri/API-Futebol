import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ligas.css'; // Certifique-se de ter o CSS correto

const Ligas = () => {
  const [ligas, setLigas] = useState([]);
  const [times, setTimes] = useState([]);
  const [partidas, setPartidas] = useState({ proximas: [], ultimas: [] });
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

  const handleTimeChange = async (timeId) => {
    setTimeSelecionado(timeId);

    try {
      const response = await axios.get(`http://localhost:3002/times/${timeId}/partidas`);
      setPartidas(response.data);
    } catch (error) {
      console.error('Erro ao buscar partidas:', error);
    }
  };

  return (
    <div>
      <div className="white-background">
        <h1>Ligas Disponíveis</h1>
        <select onChange={handleLigaChange}>
          <option value="">Selecione uma liga</option>
          {ligas.map((liga) => (
            <option key={liga.id} value={liga.id}>
              {liga.name} ({liga.code})
            </option>
          ))}
        </select>
      </div>

      {ligaSelecionada && (
        <div className="white-background">
          <h2>Times Disponíveis</h2>
          <div className="custom-select">
            {times.length > 0 ? (
              times.map((time) => (
                <div
                  key={time.id}
                  className="custom-option"
                  onClick={() => handleTimeChange(time.id)}
                >
                  <img src={time.crest} alt={`${time.name} logo`} className="team-logo" />
                  <span>{time.name}</span>
                </div>
              ))
            ) : (
              <p>Nenhum time disponível.</p>
            )}
          </div>
        </div>
      )}

      {timeSelecionado && (
        <div>
          <h2>Partidas para o Time Selecionado</h2>

          {partidas.ultimas.length > 0 && (
            <div>
              <h3>Últimas 5 Partidas</h3>
              <ul>
                {partidas.ultimas.map((partida) => (
                  <li key={partida.id}>
                    <img
                      src={partida.homeTeam.crest}
                      alt={`${partida.homeTeam.name} logo`}
                      className="team-logo-small"
                    />
                    {partida.utcDate} - {partida.homeTeam.name}{' '}
                    {partida.score.fullTime.home} x {partida.score.fullTime.away}{' '}
                    {partida.awayTeam.name}
                    <img
                      src={partida.awayTeam.crest}
                      alt={`${partida.awayTeam.name} logo`}
                      className="team-logo-small"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {partidas.proximas.length > 0 && (
            <div>
              <h3>Próximas 5 Partidas</h3>
              <ul>
                {partidas.proximas.map((partida) => (
                  <li key={partida.id}>
                    <img
                      src={partida.homeTeam.crest}
                      alt={`${partida.homeTeam.name} logo`}
                      className="team-logo-small"
                    />
                    {partida.utcDate} - {partida.homeTeam.name} vs {partida.awayTeam.name}
                    <img
                      src={partida.awayTeam.crest}
                      alt={`${partida.awayTeam.name} logo`}
                      className="team-logo-small"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {partidas.ultimas.length === 0 && partidas.proximas.length === 0 && (
            <p>Nenhuma partida disponível para este time.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Ligas;
