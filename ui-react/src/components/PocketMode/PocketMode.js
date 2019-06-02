import React from 'react';
import './PocketMode.css';
import ExcercisePage from '../ExcercisePage/ExcercisePage';
import Header from '../Header/Header';
import Ariadne from '../../util/Ariadne';

class PocketMode extends ExcercisePage {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            quizdata: {},
            wordparams: {},
            process: 'selecting'
        };
        this.initializeFirstWord = this.initializeFirstWord.bind(this);
        this.getNewRandomWord = this.getNewRandomWord.bind(this);
        this.showSolution = this.showSolution.bind(this);
        this.updateWordParams = this.updateWordParams.bind(this);
        this.startRehearsing = this.startRehearsing.bind(this);
    }

    initializeFirstWord() {
        // Getting the data from the state and listing the words
        const { dictionary } = this.state;
        console.log(dictionary);
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
        }, () => console.log(this.state.currentWord));
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
        console.log(this.state.dictionary[currentWord]);
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
        this.fetchData(startPage, endPage).then(() => console.log(this.state.dictionary));
    }

    startRehearsing() {
        this.getSelectedWords().then(() => {
            console.log(this.state.dictionary);
            this.setState({
                process: 'rehearsing'
            })
            this.initializeFirstWord();
        });
    }

    render() {
        const { dictionary, quizdata } = this.state;
        const { currentWord } = quizdata;
        const selectWordsHTML = (
            <div className="word-select">
                <input name="startPage" placeholder="Beginpagina" onChange={this.updateWordParams} autoComplete="off" />
                <input name="endPage" placeholder="Eindpagina" onChange={this.updateWordParams} autoComplete="off" />
                <button className="select-btn" onClick={this.startRehearsing}>Overhoren</button>
            </div>
        )
        const rehearsalHTML = (
            <div className="rehearsal">
                <h1>{currentWord ? `${Ariadne.toGreek(currentWord)}, ${Ariadne.renderGenus(dictionary[currentWord].genus)}` : <span className="error">Fout bij laden</span>}</h1>
                <div className="solution">
                    {this.state.quizdata.solutionHTML}
                </div>
                {this.state.solutionPage ? <button className="next" onClick={this.getNewRandomWord}>>></button> : <button className="show" onClick={this.showSolution}>Oplossing</button>}
            </div>
        );
        return (
            <div className="excercise pocket-mode">
                <Header />
                {this.state.process === 'selecting' ? selectWordsHTML : rehearsalHTML}
            </div>
        )
    }
}

export default PocketMode;