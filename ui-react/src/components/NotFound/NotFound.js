import React from 'react';
import './NotFound.css';

import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found">
            <div className="msg-content">
                <h1><span className="error-code">404</span>Ἡδε ἡ χάρτη οὐκ ηὕρηται</h1>
                <p>Deze pagina werd niet gevonden. Indien u hier bent gekomen via een link op de website ligt dit probleem mogelijk aan ons, en kunt u het probleem rapporteren.</p>
                <Link to="/"><button>Terug naar de hoofdpagina >></button></Link>
            </div>
        </div>
    )
}

export default NotFound;