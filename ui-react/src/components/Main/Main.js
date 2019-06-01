import React from 'react';
import './Main.css';

import HomeButton from '../HomeButton/HomeButton';
import Banner from '../Banner/Banner';
import Navboxline from './Navboxline/Navboxline';

function Main() {
  return (
    <div className="main">
      <HomeButton />
      <Banner />
      <Navboxline />
    </div>
  )
}

export default Main;
