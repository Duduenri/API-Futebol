import React, { useState } from 'react';
import Ligas from './components/ligas';
import Nav from './components/nav/nav';  // Importe o componente Nav

function App() {
    const [ligaId, setLigaId] = useState(null);

    console.log('Liga selecionada:', ligaId); // Liga selecionada
    return (
        <div className="App">
            <Nav /> 

            <header className="App-header">
                {!ligaId && <Ligas onSelectLiga={setLigaId} />}
            </header>
        </div>
    );
}

export default App;
