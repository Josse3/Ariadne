import React from 'react';
import './VocabulariumList.css';
import Header from '../Header/Header';
import Ariadne from '../../util/Ariadne';

class VocabulariumList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dictionary: {}
        }
        this.renderWords = this.renderWords.bind(this);
    }

    async fetchData() {
        this.setState({
            process: 'loading'
        })
        const data = await fetch('/api/search').then(response => response.json());
        this.setState({
            dictionary: data,
            process: 'loaded'
        });
    }

    renderWords() {
        const { dictionary } = this.state;
        // let html;

        const wordsListedByType = {};
        Object.keys(dictionary).forEach(word => {
            const { type } = dictionary[word]
            if (!wordsListedByType[type]) {
                wordsListedByType[type] = {};
            }
            const relevantKeysObject = {};
            const allKeys = Object.keys(dictionary[word]);
            allKeys.forEach(key => {
                const relevantKeys = allKeys.filter(normalKey => normalKey !== 'type');
                relevantKeys.forEach(relevantKey => {
                    relevantKeysObject[relevantKey] = dictionary[word][relevantKey];
                })
            })
            wordsListedByType[type][word] = relevantKeysObject;
        });

        const html = Object.keys(wordsListedByType).map(type => {
            return (
                <section key={`wordlist_${type}`} className="word-type">
                    <h1>{type}</h1>
                    <div className="word-type-content">
                        {Object.keys(wordsListedByType[type]).map(word => {
                            return (
                                <div key={`word-item-${word}`} className="word-item">
                                    <p className="word">{Ariadne.toGreek(word)}</p>
                                    {Object.values(wordsListedByType[type][word]).map(value => {
                                        const key = Object.keys(wordsListedByType[type][word]).find(key => wordsListedByType[type][word][key] === value);
                                        return <p key={`wordlist-item-${word}-${key}`} className={key}>{value}</p>
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )
        })

        this.setState({
            listHTML: html
        })
    }

    componentDidMount() {
        this.fetchData().then(() => {
            this.renderWords();
        })
    }



    render() {
        return (
            <div className="vocabularium-list" >
                <Header />
                <h1 className="title">(Ἡδε ἡ χάρτη ἓτι κατασκευάζεται)</h1>
                <div className="word-list">
                    {this.state.listHTML}
                </div>
            </div >
        )
    }
}

export default VocabulariumList;