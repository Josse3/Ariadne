import React from 'react';
import './Form.css';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="user-input">
        <form>
          <h1>(Ἡδε ἡ χάρτη ἔτι κατασκευάζεται)</h1>
          <input type="text" name="word" />
        </form>
        <button className="submit">Nakijken</button>
      </div>
    )
  }
}

export default Form;
