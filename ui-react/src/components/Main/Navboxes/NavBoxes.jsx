import React from 'react';
import './NavBoxes.css';

import NavBox from './Navbox/NavBox';

const NavBoxes = () => {
    const navBoxContents = [
        {
            title: 'Woordenlijst',
            desc: 'Bekijk de woordenlijst alvorens te overhoren',
            color: '#6C3135'
        },
        {
            title: 'Overhoor',
            desc: 'Overhoor je vocabularium met de app',
            color: '#1F4541'
        },
        {
            title: 'Leeshoek',
            desc: 'Neem een antieke tekst door na het overhoren van je vocabularium',
            color: '#6F5A32'
        }
    ]

    return (
        <div className="navboxes">
            {navBoxContents.map((box, i) => {
                return (
                    <NavBox
                        id={i + 1}
                        title={box.title}
                        desc={box.desc}
                        color={box.color}
                    />
                )
            })}
        </div>
    )
}

export default NavBoxes;