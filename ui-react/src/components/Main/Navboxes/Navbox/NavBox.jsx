import React from 'react';
import './NavBox.css';

const NavBox = props => {
    return (
        <div className={`navbox navbox-${props.id}`}>
            <div className="overlay" />
            <h1>{props.title}</h1>
            <p>{props.desc}</p>
            <button>Ga <i className="fas fa-arrow-circle-right"></i></button>
        </div>
    )
}

export default NavBox;