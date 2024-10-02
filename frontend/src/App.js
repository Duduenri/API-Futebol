import React, { useState } from 'react';
import Ligas from './components/ligas';
import Times from './components/times';
import Partidas from './components/partidas';

function App() {
    const [ligaId, setLigaId] = useState(null);
    const [timeId, setTimeId] = useState(null);

    console.log('Liga selecionada:', ligaId); // ligaaa
    return (
        <div className="App">
            <header className="App-header">
                <h1>Futebol Data</h1>
                {!ligaId && <Ligas onSelectLiga={setLigaId} />}
            </header>
        </div>
    );
}

export default App;
