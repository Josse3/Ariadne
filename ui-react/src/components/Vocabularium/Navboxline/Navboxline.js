import React from 'react';
import './Navboxline.css';
import Navbox from '../../Main/Navboxline/Navbox/Navbox';
import pocketImg from '../pocket.png';
import vocListImg from './Ankura.png';

function Navboxline() {
    return (
        <div className="vocabulary-navbox-line">
            <Navbox
                header="Overhoor vocabularium"
                description="Een module om vocabularium te overhoren: snel, efficiënt en geoptimaliseerd voor GSM's"
                backgroundColor="green"
                highlightColor="#004d00"
                backgroundImage={pocketImg}
                style={{ backgroundSize: 'cover' }}
                href="vocabularium/rehearse"
            />

            <Navbox
                header="Vocabulariumlijst"
                description="Studeer je vocabularium alvorens te overhoren aan de hand van de online vocabulariumlijst"
                backgroundColor="darkred"
                highlightColor="#660000"
                backgroundImage={vocListImg}
                style={{ backgroundSize: 'cover' }}
                href="vocabularium/list"
            />
        </div>
    );
}

export default Navboxline;