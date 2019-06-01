import React from 'react';
import Navbox from './Navbox/Navbox';
import './Navboxline.css';

import vocImg from './book-pile.png';
import dotsImg from './three-dots.svg';

class Navboxline extends React.Component {
  render() {
    return (
      <div className="navbox-line">
        <Navbox
        header="Studeer vocabularium"
        description="Verrijk je woordenschat van de Griekse taal op verschillende manieren."
        backgroundColor="darkred"
        highlightColor="#660000"
        backgroundImage={vocImg}
        href="vocabularium"
        />
        <Navbox
        header="Meer"
        description="Meer tools voor het (be)studeren en begrijpen van de Griekse taal, teksten en auteurs."
        backgroundColor="#3333ff"
        highlightColor="#0000b3"
        backgroundImage={dotsImg}
        href="more"
        />
      </div>
    )
  }
}

export default Navboxline;
