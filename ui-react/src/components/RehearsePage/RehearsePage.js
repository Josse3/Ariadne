import React, { useEffect, useState } from 'react';
import './RehearsePage.css';
import Header from '../Header/Header';
import Ariadne from '../../util/Ariadne';

function RehearsePage() {
    let dictionary = [];
    const [startPage, setStartPage] = useState();
    const [endPage, setEndPage] = useState();
    const [fetchError, setFetchError] = useState();
    const [word, setWord] = useState();
    const [remainingWords, setRemainingWords] = useState();
    const [solutionHTML, setSolutionHTML] = useState();
    const [process, setProcess] = useState('selecting');
    const [solutionPage, setSolutionPage] = useState(false);

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
                .then(jsonResponse => dictionary = jsonResponse.rows)
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
                .then(jsonResponse => dictionary = jsonResponse.rows)
                .then(startRehearsal);
        } catch (error) {
            setFetchError(String(error));
        }
    }

    const startRehearsal = () => {
        setProcess('rehearsing');
        setRemainingWords(dictionary.slice());
    }

    const provideFirstWord = () => {
        if (remainingWords) {
            const wordIndex = (Math.floor(Math.random() * remainingWords.length));
            setWord(remainingWords[wordIndex]);
            remainingWords.splice(wordIndex, 1);
            setRemainingWords(remainingWords);
        }
    }

    useEffect(provideFirstWord, [remainingWords]);

    const provideSolutionHTML = () => {
        const relevantProperties = ['translation'];
        const relevantPropertiesObj = {};
        Object.keys(word).forEach(key => { if (relevantProperties.indexOf(key) !== -1) relevantPropertiesObj[key] = word[key] });
        setSolutionPage(true);
        setSolutionHTML(<div className="solution">
            {relevantProperties.map(property => {
                return (
                    <div key={`word-property-${property}`} className="word-property">
                        <h1 className="property-title">{Ariadne.toDutch(property)}</h1>
                        <ul className="property-details">{relevantPropertiesObj[property].split(' / ').map(propertyLine => <li key={`property-line-${propertyLine}`}>{propertyLine}</li>)}</ul>
                    </div>
                );
            })}
        </div>)
    }

    const provideNextWord = () => {
        const wordIndex = (Math.floor(Math.random() * remainingWords.length));
        console.log(remainingWords);
        setWord(remainingWords[wordIndex]);
        remainingWords.splice(wordIndex, 1);
        setRemainingWords(remainingWords);
        setSolutionPage(false);
    }

    const selectingHTML = (
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

    const rehearsalHTML = (
        <div className="rehearsal">
            <h1>{word ? `${Ariadne.toGreek(word.word)}, ${Ariadne.renderGenus(word.genus)}` : ''}</h1>
            {solutionPage ?
                <>
                    {solutionHTML}
                    <button className="next-btn" onClick={provideNextWord}>ἑξης >></button>
                </>
                : <button className="show-btn" onClick={provideSolutionHTML}>δεῖξον</button>
            }
        </div>
    );

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