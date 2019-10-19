import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-scroll';
// CSS
import './AddTool.css';
import '../../styles/vocabulariumlist.css';
// Components
import Header from '../Header/Header';
// Util
import Ariadne from '../../util/Ariadne';

function AddTool() {
    // Authentication page
    const [enteredPass, setEnteredPass] = useState('');
    const [authenticationFailed, setAuthenticationFailed] = useState(false);
    // Edit interface
    const [dictionary, setDictionary] = useState([]);
    const [selectedInputField, setSelectedInputField] = useState('subst1');
    const inputFields = {
        subst1: ['word', 'genus', 'translation', 'page'],
        subst2: ['word', 'genus', 'genitive', 'translation', 'page']
    }
    const [updateWordModalId, setUpdateWordModalId] = useState(null); // Index of the word being editted in update-word modal
    const [updateWordModalInput, setUpdateWordModalInput] = useState({}); // Input inside 
    const wordInput = useRef(null); // ref for input field 'word' inside form
    const [formInput, setFormInput] = useState({});
    // Phase
    const [phase, setPhase] = useState('editing');

    // Sends request to backend which replies with boolean defining whether or not the authentication was succesful
    const authenticate = () => {
        fetch(`/authentication/addtool?password=${enteredPass}`)
            .then(response => {
                if (!response.ok) throw Error('Failed checking password in backend.');
                return response.json();
            })
            .then(jsonResponse => jsonResponse === true ? setPhase('editing') : setAuthenticationFailed(true));
    };

    // Fetches the dictionary data as soon as the user gets access to the edit interface
    useEffect(() => {
        if (phase === 'editing') {
            fetch('/db/full')
                .then(response => {
                    if (!response.ok) throw Error('Failed fetching dictionary data from backend.');
                    return response.json();
                })
                .then(setDictionary);
        }
    }, [phase]);

    // Brining up the update modal to update a certain word on button click
    const bringUpUpdateWordModal = index => {
        setUpdateWordModalInput(dictionary[index]);
        setUpdateWordModalId(index);
    }

    // Update input inside update modal
    const updateUpdateWordModalInput = event => {
        setUpdateWordModalInput({ ...updateWordModalInput, [event.target.name]: event.target.value });
    }

    // Update word from update modal
    const updateWord = () => {
        console.log(updateWordModalInput);
    }

    // Adding a word to the database
    const addWord = event => {
        event && event.preventDefault();
        const queryObject = JSON.parse(JSON.stringify(formInput));
        delete queryObject.word;
        // Composing query string
        const queryString =
            encodeURIComponent(formInput.word) +
            '?' +
            'id=' +
            (dictionary.length + 1) +
            '&' +
            Object.entries(queryObject).map(([key, value]) => {
                return key + '=' + encodeURIComponent(value);
            })
                .join('&')
                .replace(/,/g, '=') +
            '&type=subst1';


        // Fetch call
        fetch(`/db/add/${queryString}`, { method: 'PUT' })
            .then(response => {
                if (!response.ok) throw Error('Failed adding word to the database');
                return response.json();
            });

        // Resetting form
        document.querySelector('.addtool-form').reset();
        wordInput.current.focus();

        // Adding word to dictionary object to update visible vocabularium list
        setDictionary([...dictionary, {
            id: dictionary.length + 1,
            word: formInput.word,
            ...queryObject
        }]);
    }

    return (
        <div className="add-tool">
            <Header />
            {phase === 'authenticating' && (
                <div className="auth-form">
                    <input
                        type="password"
                        className="auth-input"
                        placeholder="Voer authenticatie-code in"
                        onChange={e => setEnteredPass(e.target.value)}
                        onKeyPress={e => { if (e.key === 'Enter') authenticate() }}
                    />
                    <button className="auth-btn" onClick={authenticate}>
                        Meld aan
                    </button>
                    {authenticationFailed && <div className="error">Het paswoord dat u invoerde was incorrect, gelieve het opnieuw te proberen.</div>}
                </div>
            )}

            {phase === 'editing' && (
                <div className="edit-interface">
                    <Link
                        to="form-scroll-anchor"
                        duration={500}
                        smooth={true}
                    >
                        <button>Voeg woorden toe</button>
                    </Link>
                    <h1>Substantieven eerste vervoeging</h1>
                    <div className="vocabularium-list-grid vocabularium-list-subst1">
                        <div className="subst1-header">
                            <p>#</p>
                            <p>Woord</p>
                            <p>Genus</p>
                            <p>Vertaling</p>
                            <p>Pagina</p>
                        </div>
                        {dictionary.map((wordObj, i) => {
                            return (
                                <div className="word-item word-item-subst1" key={`word-item-${wordObj.word}`}>
                                    {Object.entries(wordObj).map(([key, value]) => {
                                        let displayedParameter = value;
                                        if (key === 'word') {
                                            displayedParameter = Ariadne.toGreek(value);
                                        }
                                        if (key === 'genus') {
                                            displayedParameter = Ariadne.renderGenus(value);
                                        }
                                        return <p key={key}>{displayedParameter}</p>
                                    })}
                                    <button className="edit-button" onClick={() => bringUpUpdateWordModal(i)}>
                                        <i className="fas fa-pencil-alt"></i>
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    {updateWordModalId !== null && <div className="update-word-modal">
                        <div className="inputfields">
                            {Object.entries(dictionary[updateWordModalId]).map(([key, value]) => {
                                return (
                                    <div key={key}>
                                        <p>{Ariadne.toDutch(key)}</p>
                                        {key !== 'id' && (
                                            <input
                                                type={key === 'page' ? 'number' : 'text'}
                                                name={key}
                                                value={updateWordModalInput[key]}
                                                onChange={updateUpdateWordModalInput}
                                            />
                                        )}
                                        {key === 'id' && <p>{value}</p>}
                                    </div>
                                );
                            })}
                        </div>
                        <button onClick={updateWord}>Update</button>
                    </div>}

                    <form
                        className="addtool-form addtool-form-subst1"
                        id="form-scroll-anchor"
                        onSubmit={addWord}
                    >
                        <select value={selectedInputField} onChange={e => setSelectedInputField(e.target.value)}>
                            {Object.keys(inputFields).map(inputField => {
                                return <option value={inputField} key={inputField}>{inputField}</option>
                            })}
                        </select>
                        {inputFields[selectedInputField].map(inputField => {
                            return (
                                <input
                                    ref={inputField === 'word' ? wordInput : undefined}
                                    type={inputField === 'page' ? 'number' : 'text'}
                                    name={inputField}
                                    key={inputField}
                                    placeholder={Ariadne.toDutch(inputField)}
                                    autoComplete="off"
                                    onChange={e => setFormInput({ ...formInput, [e.target.name]: e.target.value })}
                                />
                            );
                        })}
                        <button>Voeg toe</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default AddTool;