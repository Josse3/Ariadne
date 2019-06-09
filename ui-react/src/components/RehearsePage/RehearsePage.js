import React from 'react';
import './RehearsePage.css';
import Header from '../Header/Header';
import Ariadne from '../../util/Ariadne';

class RehearsePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dictionary: {},
            quizdata: {},
            wordparams: {},
            process: 'selecting'
        };
        this.initializeFirstWord = this.initializeFirstWord.bind(this);
        this.getNewRandomWord = this.getNewRandomWord.bind(this);
        this.showSolution = this.showSolution.bind(this);
        this.updateWordParams = this.updateWordParams.bind(this);
        this.startRehearsingWithSelection = this.startRehearsingWithSelection.bind(this);
        this.startRehearsingWithoutSelection = this.startRehearsingWithoutSelection.bind(this);
    }

    async fetchData(pageStart, pageEnd) {
        // Updating page process
        this.setState({ process: 'loading' });
        // Checking if parameters are passed in
        if (pageStart && pageEnd) {
            // If so, fetch the selected part
            const data = await fetch(`/api/searchSpecific/${pageStart}/${pageEnd}`).then(response => {
                if (response.ok) {
                    return response.json();
                }
            });
            this.setState({ dictionary: data });
        } else {
            // If not, fetch the entire JSON file
            const data = await fetch('/api/search/').then(response => response.json());
            this.setState({ dictionary: data });
        }
    }

    initializeFirstWord() {
        // Getting the data from the state and listing the words
        const { dictionary } = this.state;
        const possibleWords = Object.keys(dictionary);
        // Getting a random first word
        const index = Math.floor(Math.random() * possibleWords.length);
        const firstWord = possibleWords[index];
        // Making a list of remaining words excluding the chosen word
        const remainingWords = possibleWords;
        remainingWords.splice(index, 1);
        // Updating state
        this.setState({
            quizdata: {
                remainingWords,
                currentWord: firstWord
            }
        });
    }

    showSolution() {
        // Getting properties of the current word
        const { currentWord } = this.state.quizdata;
        const wordPropertiesObject = this.state.dictionary[currentWord];
        // Deleting irrelevant info for the user
        const essentialWordProperties = {};
        const relevantKeys = ['translation'];
        const wordPropertiesList = Object.keys(wordPropertiesObject);
        wordPropertiesList.forEach(key => {
            if (relevantKeys.indexOf(key) !== -1) {
                essentialWordProperties[key] = wordPropertiesObject[key];
            }
        })

        // Formatting the translation-solution

        Object.keys(essentialWordProperties).forEach(key => {
            if (key === 'translation') {
                const differentLines = essentialWordProperties[key].split(' / ');
                console.log(differentLines);
                const formattedTranslation = (
                    <ul>
                        {differentLines.map((wordgroup, i) => {
                            return <li key={`translation_${i}`}>{wordgroup}</li>
                        })}
                    </ul>
                )
                essentialWordProperties[key] = formattedTranslation;
            }
        })

        // Mapping it into an HTML element to display to the user
        const essentialWordPropertiesList = Object.keys(essentialWordProperties);
        const solutionHTML = essentialWordPropertiesList.map(item => {
            return (
                <div key={item} className="solution-element">
                    <h2>{Ariadne.toDutch(item)}</h2>
                    <h3>{essentialWordProperties[item]}</h3>
                </div>
            )
        })
        // Updating state
        this.setState({
            quizdata: {
                ...this.state.quizdata,
                solutionHTML
            },
            solutionPage: true
        })
    }

    getNewRandomWord() {
        // Getting the remaining words and chosing a new one
        const { remainingWords } = this.state.quizdata;
        const newCurrentWordIndex = Math.floor(Math.random() * remainingWords.length);
        const newCurrentWord = remainingWords[newCurrentWordIndex];
        // Getting the new list of remaining words excluding the newly chosen one
        const newRemainingWords = remainingWords;
        newRemainingWords.splice(newCurrentWordIndex, 1);
        // Updating state
        this.setState({
            quizdata: {
                remainingWords: newRemainingWords,
                currentWord: newCurrentWord
            },
            solutionPage: false
        })
    }

    updateWordParams(event) {
        const { name } = event.target;
        const { value } = event.target
        this.setState({
            ...this.state,
            wordparams: {
                ...this.state.wordparams,
                [name]: value
            }
        });
    }

    async getSelectedWords() {
        const { startPage } = this.state.wordparams;
        const { endPage } = this.state.wordparams;
        return this.fetchData(startPage, endPage);
    }

    startRehearsingWithSelection() {
        this.getSelectedWords().then(() => {
            this.initializeFirstWord();
            this.setState({
                process: 'rehearsing'
            });
        });
    }

    startRehearsingWithoutSelection() {
        this.fetchData().then(() => {
            this.initializeFirstWord();
            this.setState({
                process: 'rehearsing'
            });
        });
    }


    render() {
        const { dictionary, quizdata } = this.state;
        const { currentWord } = quizdata;
        const selectWordsHTML = (
            <div className="word-select">
                <h1>Selecteer een begin- en eindpagina:</h1>
                <input name="startPage" placeholder="Beginpagina" onChange={this.updateWordParams} autoComplete="off" />
                <input name="endPage" placeholder="Eindpagina" onChange={this.updateWordParams} autoComplete="off" />
                <button className="select-btn" onClick={this.startRehearsingWithSelection}>Overhoren</button>
                <h1>Of</h1>
                <h1>Overhoor de hele database:</h1>
                <button className="select-btn" onClick={this.startRehearsingWithoutSelection}>Overhoren</button>
            </div>
        );

        const loadingHTML = <div className="loading" />

        const rehearsalHTML = (
            <div className="rehearsal">
                <h1>{currentWord ? `${Ariadne.toGreek(currentWord)}, ${Ariadne.renderGenus(dictionary[currentWord].genus)}` : <span className="error">Fout bij laden</span>}</h1>
                {this.state.quizdata.solutionHTML ? <div className="solution">{this.state.quizdata.solutionHTML}</div> : ''}
                {this.state.solutionPage ? <button className="next" onClick={this.getNewRandomWord}>>></button> : <button className="show" onClick={this.showSolution}>Oplossing</button>}
            </div>
        );

        let displayHTML;

        if (this.state.process === 'selecting') {
            displayHTML = selectWordsHTML;
        } else if (this.state.process === 'loading') {
            displayHTML = loadingHTML;
        } else if (this.state.process === 'rehearsing') {
            displayHTML = rehearsalHTML;
        }
        return (
            <div className="rehearse-page">
                <Header />
                {displayHTML}
            </div>
        )
    }
}

export default RehearsePage;