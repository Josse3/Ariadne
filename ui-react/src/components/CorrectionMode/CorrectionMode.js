import React from 'react';
import './CorrectionMode.css';
import ExcercisePage from '../ExcercisePage/ExcercisePage';
import Header from '../Header/Header';
import Form from './Form/Form';

class CorrectionMode extends ExcercisePage {
  render() {
    return (
      <div className="correction-mode">
        <Header />
        <Form />
      </div>
    );
  }
}

export default CorrectionMode;
