import React from 'react';
import './NavBoxes.css';

import NavBox from './Navbox/NavBox';

const NavBoxes = () => {
    const navBoxContents = [
        {
            title: 'Woordenlijst',
            desc: 'Bekijk de woordenlijst alvorens te overhoren',
            href: 'vocabulariumlist'
        },
        {
            title: 'Overhoor',
            desc: 'Overhoor je vocabularium met de app',
            href: 'rehearse'
        },
        {
            title: 'Leeshoek',
            desc: 'Neem een antieke tekst door na het overhoren van je vocabularium',
            href: 'reader'
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
                        href={box.href}
                        key={`navbox-${i}`}
                    />
                )
            })}
        </div>
    )
}

export default NavBoxes;