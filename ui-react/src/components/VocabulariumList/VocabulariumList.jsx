import React, { useState, useEffect } from 'react';
// CSS
import './VocabulariumList.css';
// Components
import Header from '../Header/Header';
import VocabulariumListGridsContainer from '../VocabulariumListGridsContainer/VocabulariumListGridsContainer';

function VocabulariumList() {
    const [dictionary, setDictionary] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [matchingWords, setMatchingWords] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            fetch('/db/full')
                .then(response => {
                    if (!response.ok) throw Error('Failed fetching data');
                    return response.json();
                })
                .then(setDictionary);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (dictionary) {
            setMatchingWords(dictionary);
        }
    }, [dictionary]);

    useEffect(() => {
        setMatchingWords(dictionary.filter(wordObj => {
            return wordObj.word.startsWith(searchTerm);
        }));
    }, [searchTerm, dictionary]);

    return (
        <div className="vocabularium-list">
            <Header />
            <h1 className="title">(Ἡδε ἡ χάρτη ἔτι κατασκευάζεται)</h1>
            <div className="searchbar">
                <input type="text" placeholder="Vul uw zoekterm in..." onChange={e => setSearchTerm(e.target.value)} />
                <button>
                    <i className="fas fa-search"></i>
                </button>
            </div>
            <VocabulariumListGridsContainer
                editable={false}
                dictionary={matchingWords}
            />
        </div>
    )
}

export default VocabulariumList;