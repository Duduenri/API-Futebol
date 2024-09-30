import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Ligas = () => {
  const [ligas, setLigas] = useState([]);

  // Função para buscar ligas do servidor Express
  useEffect(() => {
    const fetchLigas = async () => {
      try {
        const response = await axios.get('http://localhost:3002/ligas'); // URL do back-end
        setLigas(response.data); // Armazena os dados na variável de estado
      } catch (error) {
        console.error('Erro ao buscar ligas:', error);
      }
    };

    fetchLigas(); // Chama a função para buscar os dados ao carregar o componente
  }, []);

  return (
    <div>
      <h1>Ligas Disponíveis</h1>
      <ul>
        {ligas.map((liga) => (
          <li key={liga.id}>
            {liga.name} ({liga.code})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ligas;
