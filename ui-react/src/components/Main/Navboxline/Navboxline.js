import React from 'react';
import Navbox from './Navbox/Navbox';
import './Navboxline.css';

import formImg from './form.png';
import pocketImg from './pocket.png';

class Navboxline extends React.Component {
  render() {
    return (
      <div className="navbox-line">
        <Navbox
        header="Full option"
        description="Studeer vocabularium en krijg aangepaste correctie door de app"
        backgroundColor="darkred"
        highlightColor="#660000"
        backgroundImage={formImg}
        href="correctionmode"
        />
        <Navbox
        header="Pocket-versie"
        description="Maak uit voor jezelf wat goed of fout is: vlug, efficient en geoptimaliseerd voor GSM's"
        backgroundColor="green"
        highlightColor="#004d00"
        backgroundImage={pocketImg}
        href="pocketmode"
        />
      </div>
    )
  }
}

export default Navboxline;
