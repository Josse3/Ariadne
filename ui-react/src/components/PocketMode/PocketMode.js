import React from 'react';
import './PocketMode.css';
import ExcercisePage from '../ExcercisePage/ExcercisePage';
import Header from '../Header/Header';

class PocketMode extends ExcercisePage {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state, ['quizdata']: {}
        };
        this.initializeFirstWord = this.initializeFirstWord.bind(this);
        this.getNewRandomWord = this.getNewRandomWord.bind(this);
        this.showSolution = this.showSolution.bind(this);
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
        }, () => console.log(this.state.quizdata));
    }

    showSolution() {
        // Getting properties of the current word
        const { currentWord } = this.state.quizdata;
        const wordPropertiesObject = this.state.dictionary[currentWord];
        // Deleting irrelevant info for the user
        const essentialWordProperties = wordPropertiesObject;
        delete essentialWordProperties.genus;
        delete essentialWordProperties.type;
        delete essentialWordProperties.page;
        // Mapping it into an HTML element to display to the user
        const essentialWordPropertiesList = Object.keys(essentialWordProperties);
        const solutionHTML = essentialWordPropertiesList.map(item => {
            return (
                <div className="solution-element">
                    <h2>{item}</h2>
                    <h3>{essentialWordProperties[item]}</h3>
                </div>
            )
        })
        // Updating state
        this.setState({
            quizdata: {
                ...this.state.quizdata, ['solutionHTML']: solutionHTML
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
        }, () => console.log(this.state.quizdata))
    }

    async componentDidMount() {
        this.fetchData().then(this.initializeFirstWord);
    }

    render() {
        return (
            <div className="excercise pocket-mode">
                <Header />
                <h1>{this.state.quizdata.currentWord ? this.state.quizdata.currentWord : <span className="error">Fout bij laden</span>}</h1>
                <div className="solution">
                    {this.state.quizdata.solutionHTML}
                </div>
                {this.state.solutionPage ? <button className="next" onClick={this.getNewRandomWord}>>></button> : <button className="show" onClick={this.showSolution}>Oplossing</button>}
            </div>
        )
    }
}

export default PocketMode;