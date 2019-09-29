import React from 'react';
import './Main.css';

import HomeButton from '../HomeButton/HomeButton';
import Banner from '../Banner/Banner';
import NavBoxes from './Navboxes/NavBoxes';

function Main() {
  return (
    <div className="main">
      <HomeButton />
      <Banner />
      <NavBoxes />
    </div>
  )
}

export default Main;
