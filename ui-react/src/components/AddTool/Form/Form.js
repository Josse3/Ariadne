import React from 'react';
import './Form.css';

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {
                subst1: {}
            },
            history: {} 
        }

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveWord = this.saveWord.bind(this);
        
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

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            this.saveWord();
        } 
    }

    saveWord(event) {
        const toSave = {}
        Object.keys(this.state.values.subst1).forEach(key => toSave[key] = this.state.values.subst1[key]);
        fetch('/api/search')
    }

    render() {
        const fields = {
            subst1: ['woord', 'genus', 'vertaling', 'pagina']
        }
        return (
            <div className="addtool-form">
                <h1>Substantieven eerste vervoeging</h1>
                    {fields.subst1.map((field, i) => {
                        if (i !== (fields.subst1.length - 1)) {
                            return <input type="text" key={'input_' + field} name={field} placeholder={field} onChange={this.handleChange} autoComplete="off" />
                        } else {
                            return <input type="text" key={'input_' + field} name={field} placeholder={field} onChange={this.handleChange} onKeyDown={this.handleKeyDown} autoComplete="off" />
                        }
                    })}
                <button type="submit" onClick={this.saveWord}>Opslaan</button>
            </div>
        );
    }
}

export default Form;