import React from 'react';
import './CorrectionMode.css';
import Header from '../Header/Header';
import Form from './Form/Form';

class CorrectionMode extends React.Component {
  render() {
    return (
      <div className="correction-mode">
        <Header />
        <Form wordtype="subst1" />
      </div>
    );
  }
}

export default CorrectionMode;
