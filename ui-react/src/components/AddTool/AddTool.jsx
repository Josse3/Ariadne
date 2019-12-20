import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-scroll';
// CSS
import './AddTool.css';
import '../../styles/vocabulariumlist.css';
// Components
import Header from '../Header/Header';
import Form from './Form/Form';
import Modal from './Modal/Modal';
// Util
import Ariadne from '../../util/Ariadne';

function AddTool() {
    // Authentication page
    const [enteredPass, setEnteredPass] = useState('');
    const [authenticationFailed, setAuthenticationFailed] = useState(false);
    // Edit interface
    const [dictionary, setDictionary] = useState([]);
    const [listStructure, setListStructure] = useState([]);
    useEffect(() => {
        if (dictionary.length > 0 && listStructure.length === 0) {
            setListStructure([
                { subst1: 0 },
                { subst2: dictionary.findIndex(wordObj => wordObj.genitive !== null) }
            ]);
        };
    }, [dictionary, listStructure]);

    const [updateWordModalInput, setUpdateWordModalInput] = useState({}); // Default input of update-word modal
    const [updateWordModalId, setUpdateWordModalId] = useState(null); // Index of the word being editted in update-word modal (null if hidden)

    const [insertWordModalId, setInsertWordModalId] = useState(null); // Index of the new word to be added in the insert-word modal (null if hidden)
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

    // Rerender liststructure whenever dictionary is updated
    useEffect(() => {
        if (dictionary.length > 0) {
            setListStructure([...listStructure]);
        }
    }, [dictionary]);

    const closeModal = () => {
        setUpdateWordModalId(null);
        setInsertWordModalId(null);
    }

    // Brining up the update modal to update a certain word on button click
    const bringUpUpdateWordModal = index => {
        setUpdateWordModalInput(dictionary[index]);
        setUpdateWordModalId(index);
    }

    // Update word from update modal
    const updateWord = formInput => {
        const queryParameters = { ...formInput };
        delete queryParameters.id;
        const queryString =
            Object.entries(queryParameters).map(([key, value]) => {
                return key + '=' + encodeURIComponent(value);
            })
                .join('&');

        fetch(`/db/update/${formInput.id}?${queryString}`, { method: 'PUT' })
            .then(response => {
                if (!response.ok) throw Error(`${response.status} (${response.statusText})`)
            });

        setUpdateWordModalId(null); // Hides modal
        // Updating visible word list
        const newDictionary = dictionary.slice();
        newDictionary[updateWordModalInput.id - 1] = formInput;
        setDictionary(newDictionary);
    }

    // Deleting a word via the "update word" modal
    const deleteWord = index => {
        fetch(`/db/delete/${index + 1}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw Error(`Failed deleting word in database: ${response.status} (${response.statusText})`);
                return response.json();
            });
        const newDictionary = dictionary.slice();
        newDictionary.splice(index, 1);
        // Decrementing id of all words that come after by one 
        newDictionary.map((word, i) => {
            if (i >= index) {
                word.id--;
            }
        })

        // Close modal
        setUpdateWordModalId(null);

        setDictionary(newDictionary);
    }

    // Bring up insert modal via insert button
    const bringUpInsertWordModal = index => {
        setInsertWordModalId(index);
    }

    // Inserting a word between to existing words in the database
    const insertWord = formInput => {
        console.log({ id: insertWordModalId, ...formInput });
        setInsertWordModalId(null);
    }

    // Adding a word to the database
    const addWord = formInput => {
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

                    {listStructure.map((part, i) => {
                        const partName = Object.keys(part)[0];
                        const breakpoint = Object.values(part)[0];
                        const nextPartBreakpoint = listStructure[i + 1] !== undefined ? Object.values(listStructure[i + 1])[0] : dictionary.length;
                        return (
                            <div className={`vocabularium-list-grid vocabularium-list-${partName}`} key={`${part}-${i}`}>
                                {partName === "subst1" && (
                                    <h1>Substantieven eerste vervoeging</h1>
                                )}
                                {partName === "subst2" && (
                                    <h1>Substantieven tweede vervoeging</h1>
                                )}
                                <>
                                    <div className={`section-header ${partName}-header`}>
                                        {partName === "subst1" && (
                                            <>
                                                <p>#</p>
                                                <p>Woord</p>
                                                <p>Genus</p>
                                                <p>Vertaling</p>
                                                <p>Pagina</p>
                                            </>
                                        )}
                                        {partName === "subst2" && (
                                            <>
                                                <p>#</p>
                                                <p>Woord</p>
                                                <p>Genitief</p>
                                                <p>Genus</p>
                                                <p>Vertaling</p>
                                                <p>Pagina</p>
                                            </>
                                        )}
                                    </div>
                                    {dictionary.slice(breakpoint, nextPartBreakpoint).map((wordObj, i) => {
                                        return (
                                            <div className={`word-item word-item-${partName}`} key={`word-item-${wordObj.word}`}>
                                                {i !== 0 && <button className="insert-button" onClick={() => bringUpInsertWordModal(i + 1)}>+</button>}
                                                {Object.entries(wordObj).map(([key, value]) => {
                                                    if (value !== null) {
                                                        let displayedParameter = value;
                                                        if (key === 'word' || key === 'genitive') {
                                                            displayedParameter = Ariadne.toGreek(value);
                                                        }
                                                        if (key === 'genus') {
                                                            displayedParameter = Ariadne.renderGenus(value);
                                                        }
                                                        return <p key={key}>{displayedParameter}</p>
                                                    };
                                                })}
                                                <button className="edit-button" onClick={() => bringUpUpdateWordModal(breakpoint + i)}>
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                            </div>
                                        )
                                    })}
                                </>
                            </div>
                        );
                    })}
                    {updateWordModalId !== null && (
                        <Modal
                            type="update-word"
                            dictionary={dictionary}
                            id={updateWordModalId}
                            input={updateWordModalInput}
                            handleWordUpdate={updateWord}
                            handleModalClose={closeModal}
                            handleWordDelete={deleteWord}
                        />
                    )}

                    {insertWordModalId !== null && (
                        <Modal
                            type="insert-word"
                            handleWordInsert={insertWord}
                            handleModalClose={closeModal}
                        />
                    )}

                    <Form
                        handleSubmit={addWord}
                    />
                </div>
            )}
        </div>
    )
}

export default AddTool;