// Times.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Times = ({ ligaId, onSelectTime }) => {
    const [times, setTimes] = useState([]);

    useEffect(() => {
        const fetchTimes = async () => {
            if (!ligaId) return; // Garante que o ligaId é válido
            console.log('Buscando times para a liga ID:', ligaId); // Log para verificar a ligaId
            try {
                const response = await axios.get(`http://localhost:3002/ligas/${ligaId}/times`);
                console.log('Times recebidos:', response.data); // Log para verificar os dados
                setTimes(response.data.teams || []); // Verifique se os dados estão no formato esperado
            } catch (error) {
                console.error('Erro ao buscar times:', error);
            }
        };

        fetchTimes();
    }, [ligaId]);

    return (
        <div>
            <h2>Selecione um Time</h2>
            {times.length > 0 ? (
                <select onChange={(e) => onSelectTime(e.target.value)}>
                    <option value="">Selecione um time</option>
                    {times.map((time) => (
                        <option key={time.id} value={time.id}>
                            {time.name}
                        </option>
                    ))}
                </select>
            ) : (
                <p>Nenhum time encontrado.</p>
            )}
        </div>
    );
};

export default Times;
