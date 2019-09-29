import React from 'react';
import './NavBox.css';

const NavBox = props => {
    return (
        <div className={`navbox navbox-${props.id}`} style={{ background: props.color }}>
            <h1>{props.title}</h1>
            <p>{props.desc}</p>
        </div>
    )
}

export default NavBox;