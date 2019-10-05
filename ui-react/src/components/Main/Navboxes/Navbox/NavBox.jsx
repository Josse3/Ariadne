import React from 'react';
import { Link } from 'react-router-dom';
import './NavBox.css';

const NavBox = props => {
    return (
        <div className={`navbox navbox-${props.id}`}>
            <div className="overlay" />
            <h1>{props.title}</h1>
            <p>{props.desc}</p>
            <Link to={props.href}><button>Ga <i className="fas fa-arrow-circle-right"></i></button></Link>
        </div>
    )
}

export default NavBox;