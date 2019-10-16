import React, { useState, useEffect } from 'react';
import './AddTool.css';
import Header from '../Header/Header';
import Ariadne from '../../util/Ariadne';

function AddTool() {
    const [enteredPass, setEnteredPass] = useState('');
    const [authenticationFailed, setAuthenticationFailed] = useState(false);
    const [phase, setPhase] = useState('authenticating');

    const authenticate = () => {
        fetch(`/authentication/addtool?password=${enteredPass}`)
            .then(response => {
                if (!response.ok) throw Error('Failed checking password in backend.');
                return response.json();
            })
            .then(jsonResponse => jsonResponse === true ? setPhase('editing') : setAuthenticationFailed(true));
    };

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
                </div>
            )}
        </div>
    )
}

export default AddTool;