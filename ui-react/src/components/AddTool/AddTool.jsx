import React, { useState, useEffect, useRef } from 'react';
import './AddTool.css';
import Header from '../Header/Header';
import Ariadne from '../../util/Ariadne';

function AddTool() {
    const [enteredPass, setEnteredPass] = useState('');
    const [phase, setPhase] = useState('authenticating');

    const authenticate = () => setPhase('editing');

    return (
        <div className="add-tool">
            <Header />
            {phase === 'authenticating' && (
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
            )}

            {phase === 'editing' && (
                <div className="edit-interface">
                </div>
            )}
        </div>
    )
}

export default AddTool;