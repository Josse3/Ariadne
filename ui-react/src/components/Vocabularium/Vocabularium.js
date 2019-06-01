import React from 'react';

import './Vocabularium.css';
import Banner from '../Banner/Banner';
import HomeButton from '../HomeButton/HomeButton';
import Navboxline from './Navboxline/Navboxline';

function Vocabularium() {
    return (
        <div className="vocabularium">
            <HomeButton />
            <Banner text="Studeer vocablarium" />
            <Navboxline />
        </div>
    )
}

export default Vocabularium;