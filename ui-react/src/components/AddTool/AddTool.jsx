import React, { useState, useEffect, useRef } from 'react';
import './AddTool.css';
import Header from '../Header/Header';
import Ariadne from '../../util/Ariadne';

function AddTool() {
    const [enteredPass, setEnteredPass] = useState('');
    const [phase, setPhase] = useState('authenticating');

    const authenticate = () => setPhase('entering');

    let displayHTML;

    const authenticationHTML = (
        <form className="auth-form">
            <input
                type="password"
                className="auth-input"
                placeholder="Voer authenticatie-code in"
                onChange={e => setEnteredPass(e.target.value)}
            />
            <button className="auth-btn" onClick={authenticate}>
                Meld aan
            </button>
        </form>
    )

    const enteringHTML = (
        <div className="input-form">
            
        </div>
    )

    if (phase === 'authenticating') {
        displayHTML = authenticationHTML;
    } else if (phase === 'entering') {
        displayHTML = enteringHTML;
    } else {
        throw Error('Invalid phase');
    }

    return (
        <div className="add-tool">
            <Header />
            {phase === 'authenticating' && authenticationHTML}
        </div>
    )
}

export default AddTool;