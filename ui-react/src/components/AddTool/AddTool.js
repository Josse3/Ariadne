import React, { useState, useEffect, useRef } from 'react';
import './AddTool.css';
import Header from '../Header/Header';
import Ariadne from '../../util/Ariadne';

function AddTool() {
    const [enteredPass, setEnteredPass] = useState('');
    const inputFieldNames = {
        subst1: ['woord', 'genus', 'vertaling', 'pagina'],
        subst2: ['woord', 'genitief', 'genus', 'vertaling', 'pagina']
    }
    const types = Object.keys(inputFieldNames);
    const [currentType, setCurrentType] = useState(Object.keys(inputFieldNames)[0]);
    const [toPush, setToPush] = useState({});
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const [phase, setPhase] = useState('authenticating');

    const authenticate = () => setPhase('entering');

    const updateInput = event => {
        const { name, value } = event.target;
        setToPush({ ...toPush, [name]: value });
    };

    const pushData = () => {
        const query = {};
        Object.keys(toPush).forEach(property => {
            const englishProperty = property
                .replace('woord', 'word')
                .replace('vertaling', 'translation')
                .replace('pagina', 'page');
            query[englishProperty] = toPush[property];
        });
        let queryString = "";
        Object.keys(query).forEach((property, i) => {
            if (i === 0) return queryString += `${query[property].replace('/', '%2F').replace('=', '%3D')}?`
            queryString += `${i === 1 ? '' : '&'}${property}=${query[property]}`;
        });
        fetch(`/db/add/${queryString}&type=${currentType}&key=${enteredPass}`, { method: 'PUT' })
            .then(response => { if (!response.ok) throw Error(`${response.status}: ${response.statusText}`) })
            .catch(error => setError(String(error)));
        console.log(toPush);
        setHistory([...history, toPush])
    }

    useEffect(() => console.log(history), [history]);

    const wordInput = useRef(null);

    const handleFormSubmit = event => {
        document.querySelector('.add-tool form').reset();
        wordInput.current.focus();
        if (event.type !== 'keypress') event.preventDefault();
    }


    const inputFields = inputFieldNames[currentType].map(field => {
        return <input
            key={`input-field-${field}`}
            ref={field === 'woord' ? wordInput : null}
            type="text"
            name={field}
            placeholder={field}
            autoComplete="off"
            onChange={updateInput}
            onKeyPress={field === 'pagina' ? e => { if (e.key === 'Enter') handleFormSubmit(e) } : null}
        />
    });

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
            <select onChange={e => setCurrentType(e.target.value)}>
                {types.map(type => <option key={`option-${type}`} value={type}>{type}</option>)}
            </select>
            <form onSubmit={handleFormSubmit}>
                {inputFields}
                <button onClick={pushData}>Opslaan</button>
            </form>
            {error ?
                <div className="error">
                    Er is een fout opgetreden bij het opslaan van uw data in de database. Het volgende errorbericht werd meegegeven:
                    <span className="error-msg">{error}</span>
                </div>
                : ''}
            {history.length ?
                <div className="history">
                    {history.map(wordObj => {
                        return (
                            <div className="word-history-line" key={`word-history-line-${wordObj.woord}`}>
                                {Object.keys(wordObj).map(property => {
                                    let propertyToRender;
                                    if (property === 'woord') {
                                        propertyToRender = Ariadne.toGreek(wordObj[property]);
                                    } else if (property === 'genus') {
                                        propertyToRender = Ariadne.renderGenus(wordObj[property]);
                                    } else {
                                        propertyToRender = wordObj[property];
                                    }
                                    return (
                                        <p key={`${wordObj.woord}-property-${property}`}>{propertyToRender}</p>
                                    );
                                })}
                            </div>
                        )
                    })}
                </div>
                : ''}
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
            {displayHTML}
        </div>
    )
}

export default AddTool;