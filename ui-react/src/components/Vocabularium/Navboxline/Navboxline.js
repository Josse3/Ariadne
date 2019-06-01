import React from 'react';
import './Navboxline.css';
import Navbox from '../../Main/Navboxline/Navbox/Navbox';

import formImg from '../form.png';
import pocketImg from '../pocket.png';

function Navboxline() {
    return (
        <div className="vocabulary-navbox-line">
            <Navbox
                header="Full option"
                description="Studeer vocabularium en krijg aangepaste correctie door de app"
                backgroundColor="darkred"
                highlightColor="#660000"
                backgroundImage={formImg}
                href="vocabularium/correctionmode"
            />
            <Navbox
                header="Pocket-versie"
                description="Maak uit voor jezelf wat goed of fout is: vlug, efficient en geoptimaliseerd voor GSM's"
                backgroundColor="green"
                highlightColor="#004d00"
                backgroundImage={pocketImg}
                href="vocabularium/pocketmode"
            />
        </div>
    );
}

export default Navboxline;