import React, { useState, useRef } from 'react';
import Ariadne from '../../../util/Ariadne';

const Form = props => {
    const [selectedInputField, setSelectedInputField] = useState('subst1');
    const inputFields = {
        subst1: ['word', 'genus', 'translation', 'page'],
        subst2: ['word', 'genitive', 'genus', 'translation', 'page']
    }
    const wordInput = useRef(null); // ref for input field 'word' inside form
    const [formInput, setFormInput] = useState({});

    const handleFormSubmit = event => {
        event.preventDefault();
        props.handleSubmit({ ...formInput, type: selectedInputField });

        // Resetting form
        document.querySelector('.addtool-form').reset();
        wordInput.current.focus();
    }

    return (
        <form
            className="addtool-form"
            id="form-scroll-anchor"
            onSubmit={handleFormSubmit}
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
    )
}

export default Form;