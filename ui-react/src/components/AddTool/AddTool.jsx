import React, { useState, useEffect } from 'react';
// CSS
import './AddTool.css';
import '../../styles/vocabulariumlist.css';
// Components
import Header from '../Header/Header';
// Util
import Ariadne from '../../util/Ariadne';

function AddTool() {
    // Authentication page
    const [enteredPass, setEnteredPass] = useState('');
    const [authenticationFailed, setAuthenticationFailed] = useState(false);
    // Edit interface
    const [dictionary, setDictionary] = useState([]);
    // Phase
    const [phase, setPhase] = useState('editing');

    // Sends request to backend which replies with boolean defining whether or not the authentication was succesful
    const authenticate = () => {
        fetch(`/authentication/addtool?password=${enteredPass}`)
            .then(response => {
                if (!response.ok) throw Error('Failed checking password in backend.');
                return response.json();
            })
            .then(jsonResponse => jsonResponse === true ? setPhase('editing') : setAuthenticationFailed(true));
    };

    // Fetches the dictionary data as soon as the user gets access to the edit interface
    useEffect(() => {
        if (phase === 'editing') {
            fetch('/db/full')
                .then(response => {
                    if (!response.ok) throw Error('Failed fetching dictionary data from backend.');
                    return response.json();
                })
                .then(setDictionary);
        }
    }, [phase])

    return (
        <div className="add-tool">
            <Header />
            {phase === 'authenticating' && (
                <div className="auth-form">
                    <input
                        type="password"
                        className="auth-input"
                        placeholder="Voer authenticatie-code in"
                        onChange={e => setEnteredPass(e.target.value)}
                        onKeyPress={e => { if (e.key === 'Enter') authenticate() }}
                    />
                    <button className="auth-btn" onClick={authenticate}>
                        Meld aan
                    </button>
                    {authenticationFailed && <div className="error">Het paswoord dat u invoerde was incorrect, gelieve het opnieuw te proberen.</div>}
                </div>
            )}

            {phase === 'editing' && (
                <div className="edit-interface">
                    <h1>Substantieven eerste vervoeging</h1>
                    <div className="vocabularium-list-grid vocabularium-list-subst1">
                        <div className="subst1-header">
                            <p>#</p>
                            <p>Woord</p>
                            <p>Geslacht</p>
                            <p>Vertaling</p>
                            <p>Pagina</p>
                        </div>
                        {dictionary.map(wordObj => {
                            return (
                                <div className="word-item-subst1" key={`word-item-${wordObj.word}`}>
                                    {Object.entries(wordObj).map(([key, value]) => {
                                        let displayedParameter = value;
                                        if (key === 'word') {
                                            displayedParameter = Ariadne.toGreek(value);
                                        }
                                        if (key === 'genus') {
                                            displayedParameter = Ariadne.renderGenus(value);
                                        }
                                        return <p key={key}>{displayedParameter}</p>
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddTool;