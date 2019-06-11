import React from 'react';
import './Form.css';

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fields: {
                subst1: ['woord', 'genus', 'vertaling', 'pagina']
            },
            values: {
                subst1: {}
            },
            history: {}
        }

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveWord = this.saveWord.bind(this);
        this.clearFields = this.clearFields.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    componentWillMount() {
        const { fields } = this.state;
        const fieldNames = Object.keys(fields);
        fieldNames.forEach(wordtype => {
            const firstInputName = fields[wordtype][0];
            const refName = wordtype + firstInputName.charAt(0).toUpperCase() + firstInputName.slice(1);
            this[refName] = React.createRef();
        })
    }

    handleChange(event) {
        const { target } = event;
        const name = target.name;
        const value = target.value;
        this.setState({
            values: {
                subst1: {
                    ...this.state.values.subst1, [name]: value
                }
            }
        });
    }

    clearFields() {
        document.querySelector('.subst1-form').reset();
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            this.saveWord();
            this.clearFields();
            this.subst1Woord.current.focus();
        }
    }

    handleButtonClick() {
        this.saveWord();
        this.clearFields();
        this.subst1Woord.current.focus();
    }

    saveWord() {
        let toSave = {};
        Object.keys(this.state.values.subst1).forEach(key => toSave[key] = this.state.values.subst1[key].replace('/', '%2F').replace('=', '%3D'));
        if (toSave.woord && toSave.genus && toSave.vertaling && toSave.pagina) {
            fetch(`/api/add/${toSave.woord}?type=subst1&genus=${toSave.genus}&translation=${toSave.vertaling}&page=${toSave.pagina}`, { method: 'PUT' })
                .then(response => {
                    console.log(response);
                    if (response.ok) {
                        return response.json();
                    } else {
                        Error('Request failed.');
                    }
                    toSave = {};
                })
                .then(jsonResponse => console.log(jsonResponse));
        } else {
            console.log('Invalid or incomplete input.');
        }
    }

    render() {
        return (
            <div className="addtool-form">
                <h1>Substantieven eerste vervoeging</h1>
                <form className="subst1-form">
                    {this.state.fields.subst1.map((field, i) => {
                        const { length } = this.state.fields.subst1;
                        return <input type="text" key={`input_${field}`} name={field} placeholder={field} onChange={this.handleChange} autoComplete="off" ref={i === 0 ? this.subst1Woord : undefined} onKeyDown={i === (length - 1) ? this.handleKeyDown : undefined} />
                    })}
                </form>
                <button type="submit" onClick={this.handleButtonClick}>Opslaan</button>
            </div>
        );
    }
}

export default Form;