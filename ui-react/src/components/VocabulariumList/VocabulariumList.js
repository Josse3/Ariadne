import React, { useState, useEffect } from 'react';
import './VocabulariumList.css';
import Header from '../Header/Header';
import Ariadne from '../../util/Ariadne';

function VocabulariumList() {
    const [dictionary, setDictionary] = useState([]);
    const [wordListHTML, setWordListHTML] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            fetch('/db/full')
                .then(response => {
                    if (!response.ok) throw Error('Failed fetching data');
                    return response.json();
                })
                .then(jsonResponse => setDictionary(jsonResponse.rows));
        }
        fetchData();
    }, []);

    const provideListHTML = () => {
        if (dictionary) {
            setWordListHTML(
                <div className="word-list">
                    <div className="subst1-header">
                        <p>Woord</p>
                        <p>Genus</p>
                        <p>Vertaling</p>
                        <p>Pagina</p>
                    </div>
                    {dictionary.map(wordObj => {
                        return (
                            <div key={`word-item-${wordObj.word}`} className="word-item">
                                {Object.keys(wordObj).map(wordProperty => {
                                    let displayedProperty;
                                    if (wordProperty === 'word') {
                                        displayedProperty = Ariadne.toGreek(wordObj[wordProperty]);
                                    } else if (wordProperty === 'genus') {
                                        displayedProperty = Ariadne.renderGenus(wordObj[wordProperty]);
                                    } else {
                                        displayedProperty = wordObj[wordProperty];
                                    }
                                    return <p key={`word-item-detail-${wordObj.word}-${wordProperty}`} className="word-item-detail">{displayedProperty}</p>
                                })}
                            </div>
                        );
                    })}
                </div>)
        }
    }

    useEffect(provideListHTML, [dictionary]);

    return (
        <div className="vocabularium-list">
            <Header />
            <h1 className="title">(Ἡδε ἡ χάρτη ἔτι κατασκευάζεται)</h1>
            {wordListHTML}
        </div>
    )
}

export default VocabulariumList;