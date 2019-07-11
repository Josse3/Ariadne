import React from 'react';

import './Vocabularium.css';
import Header from '../Header/Header';
import Banner from '../Banner/Banner';
import Navboxline from './Navboxline/Navboxline';

function Vocabularium() {
    return (
        <div className="vocabularium">
            <Header />
            <Banner text="Studeer vocabularium" />
            <Navboxline />
        </div>
    )
}

export default Vocabularium;