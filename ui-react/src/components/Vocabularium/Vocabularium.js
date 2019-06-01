import React from 'react';

import './Vocabularium.css';
import Banner from '../Banner/Banner';
import Navboxline from './Navboxline/Navboxline';

function Vocabularium() {
    return (
        <div className="vocabularium">
            <Banner text="Studeer vocablarium" />
            <Navboxline />
        </div>
    )
}

export default Vocabularium;