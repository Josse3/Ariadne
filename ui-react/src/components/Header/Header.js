import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <div className="header">
      <Link to="/"><h3>Ἀριάδνη</h3></Link>
    </div>
  )
}

export default Header;
