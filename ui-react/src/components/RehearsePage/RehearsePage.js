import React, { useEffect, useState } from 'react';
import './RehearsePage.css';
import Header from '../Header/Header';

function RehearsePage() {
    const [dictionary, setDictionary] = useState([]);
    const [startPage, setStartPage] = useState();
    const [endPage, setEndPage] = useState();
    const [fetchError, setFetchError] = useState();
    const [wordIndex, setWordIndex] = useState();
    const [remainingWords, setRemainingWords] = useState();
    const [process, setProcess] = useState('selecting');

    const updateWordParams = event => {
        if (event.target.name === 'startPage') setStartPage(event.target.value);
        if (event.target.name === 'endPage') setEndPage(event.target.value);
    }

    const startRehearsingWithSelection = () => {
        try {
            if (!startPage || !endPage) throw Error('Invalid start/end page')
            setProcess('loading');
            fetch(`/db/specific/${startPage}/${endPage}`)
                .then(response => {
                    if (response.ok) return response.json();
                    throw Error('Failed fetching data');
                })
                .then(jsonResponse => setDictionary(jsonResponse))
                .then(startRehearsal);
        } catch (error) {
            setFetchError(String(error));
        }
    }

    const startRehearsingWithoutSelection = () => {
        try {
            setProcess('loading');
            fetch('/db/full')
                .then(response => {
                    if (response.ok) return response.json();
                    throw Error('Failed fetching data')
                })
                .then(jsonResponse => setDictionary(jsonResponse.rows))
                .then(startRehearsal);
        } catch (error) {
            setFetchError(String(error));
        }
    }

    const startRehearsal = () => {
        setProcess('rehearsing');
        setWordIndex(Math.floor(Math.random() * dictionary.length));
        console.log(dictionary);
        setRemainingWords(dictionary.slice().splice(wordIndex, 1));
    }
    useEffect(() => console.log(remainingWords), [remainingWords]);

    let selectingHTML = (
        <div className="word-select">
            <h1>Selecteer een begin- en eindpagina:</h1>
            <input name="startPage" placeholder="Beginpagina" onChange={updateWordParams} autoComplete="off" />
            <input name="endPage" placeholder="Eindpagina" onChange={updateWordParams} autoComplete="off" />
            <button className="select-btn" onClick={startRehearsingWithSelection}>Overhoren</button>
            {fetchError ? <div className="error">Er ging iets mis met het opvragen van de data. Het volgende errorbericht werd meegegeven: <span className="error-msg">{fetchError}</span></div> : ''}
            <h1>Of</h1>
            <h1>Overhoor de hele database:</h1>
            <button className="select-btn" onClick={startRehearsingWithoutSelection}>Overhoren</button>
        </div>
    )

    const loadingHTML = <div className="loading" />

    const rehearsalHTML = '';

    let displayHTML;

    switch (process) {
        case 'selecting':
            displayHTML = selectingHTML;
            break;
        case 'loading':
            displayHTML = loadingHTML;
            break;
        case 'rehearsing':
            displayHTML = rehearsalHTML;
            break;
    }

    return (
        <div className="rehearse-page">
            <Header />
            {displayHTML}
        </div>
    )
}

export default RehearsePage;