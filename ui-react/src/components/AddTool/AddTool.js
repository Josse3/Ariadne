import React, { useState, useEffect, useRef } from 'react';
import './AddTool.css';
import Header from '../Header/Header';

function AddTool() {
    const inputFieldNames = {
        subst1: ['woord', 'genus', 'vertaling', 'pagina'],
        subst2: ['woord', 'genitief', 'genus', 'vertaling', 'pagina']
    }
    const types = Object.keys(inputFieldNames);
    const [currentType, setCurrentType] = useState(Object.keys(inputFieldNames)[0]);
    const [toPush, setToPush] = useState({});
    const [pageInput, setPageInput] = useState();
    const [error, setError] = useState('');

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
        try {
            fetch(`/db/add/${queryString}&type=${currentType}`, { method: 'PUT' })
                .then(response => { if (!response.ok) throw Error('Failed pushing data') })
        } catch (error) {
            setError(String(error));
        }
    }

    const wordInput = useRef(null);

    const reset = event => {
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
            onKeyPress={field === 'pagina' ? e => { if (e.key === 'Enter') reset(e) } : null}
        />
    });

    return (
        <div className="add-tool">
            <Header />
            <select onChange={e => setCurrentType(e.target.value)}>
                {types.map(type => <option key={`option-${type}`} value={type}>{type}</option>)}
            </select>
            <form onSubmit={reset}>
                {inputFields}
                <button onClick={pushData}>Opslaan</button>
            </form>
            {error ?
                <div className="error">
                    Er is een fout opgetreden bij het opslaan van uw data in de database. Het volgende errorbericht werd meegegeven:
                    <span className="error-msg">{error}</span>
                </div>
                : ''}
            <div className="history">

            </div>
        </div>
    )
}

export default AddTool;