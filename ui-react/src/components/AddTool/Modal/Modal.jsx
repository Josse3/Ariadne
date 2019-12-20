import React, { useState } from 'react';
import './Modal.css';

import Form from '../Form/Form';

import Ariadne from '../../../util/Ariadne';

const Modal = props => {
    const [updateWordModalInput, setUpdateWordModalInput] = useState(props.input); // Input of update-word modal

    // Update input inside update modal
    const updateUpdateWordModalInput = event => {
        setUpdateWordModalInput({ ...updateWordModalInput, [event.target.name]: event.target.value });
    }

    return (
        <div className="modal">
            <button className="close-button" onClick={props.handleModalClose}>x</button>
            {props.type === 'update-word' && (
                <>
                    <div className="inputfields">
                        {Object.entries(props.dictionary[props.id]).map(([key, value]) => {
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
                    <div className="button-row">
                        <button onClick={e => props.handleWordUpdate(updateWordModalInput)}>Update</button>
                        <button onClick={() => props.handleWordDelete(props.id)} className="delete-button">Verwijderen</button>
                    </div>
                </>
            )}
            {props.type === 'insert-word' && (
                <>
                    <Form
                        handleSubmit={props.handleWordInsert}
                    />
                </>
            )}
        </div>
    );
}

export default Modal;