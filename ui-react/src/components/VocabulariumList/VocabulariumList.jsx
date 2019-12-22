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
    const [listShouldRerender, setListShouldRerender] = useState(true); // True to render on mount

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

    const handleSearchTermChange = event => {
        setListShouldRerender(true);
        setSearchTerm(event.target.value);
    }

    return (
        <div className="vocabularium-list">
            <Header />
            <div className="searchbar-container">
                <div className="searchbar">
                    <input type="text" placeholder="Vul uw zoekterm in..." onChange={handleSearchTermChange} />
                    <button>
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>
            <VocabulariumListGridsContainer
                editable={false}
                dictionary={matchingWords}
                shouldRerender={listShouldRerender}
                onRerender={() => setListShouldRerender(false)}
            />
        </div>
    )
}

export default VocabulariumList;