import React from 'react';
import './Form.css';

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fields: {
                subst1: ['woord', 'genus', 'vertaling', 'pagina'],
                subst2: []
            },
            values: {
                subst1: {}
            },
            inputFieldToRender: 'subst1'
        }

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveWord = this.saveWord.bind(this);
        this.clearFields = this.clearFields.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
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
        // this.subst1Woord.current.focus();
    }

    saveWord() {
        const allFieldsFilled = () => {
            return Object.keys(this.state.values[this.state.inputFieldToRender]).length === this.state.fields[this.state.inputFieldToRender].length;
        }
        if (allFieldsFilled()) {
            const toSave = {};
            Object.keys(this.state.values[this.state.inputFieldToRender]).forEach(property => {
                toSave[property] = this.state.values[this.state.inputFieldToRender][property].replace('/', '%2F').replace('=', '%3D');
            })
            fetch(`./db/add/${toSave.woord}?genus=${toSave.genus}&translation=${toSave.vertaling}&page=${toSave.pagina}&type=${this.state.inputFieldToRender}`, { method: 'PUT' })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw Error(`${response.status} ${response.statusText}`);
                    }
                })
                .then(jsonResponse => console.log(jsonResponse))
                .catch(error => this.setState({ error: String(error) }));
        } else {
            console.log('Invalid or incomplete input.');
        }
    }

    handleSelectChange(event) {
        this.setState({ inputFieldToRender: event.target.value }, () => console.log(this.state.inputFieldToRender));
    }

    render() {
        let inputFields;
        inputFields = this.state.fields[this.state.inputFieldToRender].map((field, i) => {
            const { length } = this.state.fields.subst1;
            return <input type="text" key={`input_${field}`} name={field} placeholder={field} onChange={this.handleChange} autoComplete="off" ref={i === 0 ? this.subst1Woord : undefined} onKeyDown={i === (length - 1) ? this.handleKeyDown : undefined} />
        });
        return (
            <div className="addtool-form">
                <form className="subst1-form">
                    <select value={this.state.inputFieldToRender} onChange={this.handleSelectChange}>{Object.keys(this.state.fields).map(field => <option key={`field-${field}`}>{field}</option>)}</select>
                    {inputFields}
                </form>
                <button type="submit" onClick={this.handleButtonClick}>Opslaan</button>
                {this.state.error ?
                    <div className="error">Er is een fout opgetreden bij het opslaan van uw data in de database. Het volgende errorbericht werd meegegeven: <span className="error-msg">{this.state.error}</span></div>
                    : ''}
            </div>
        );
    }
}

export default Form;