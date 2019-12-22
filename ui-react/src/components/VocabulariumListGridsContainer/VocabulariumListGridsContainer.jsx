import React, { useState, useEffect } from 'react';
import './VocabulariumListGridsContainer.css';

// Util
import Ariadne from '../../util/Ariadne';

const VocabulariumListGridsContainer = props => {
    const [listStructure, setListStructure] = useState([]);

    useEffect(() => {
        if (props.shouldRerender || props.dictionary.length > 0) {
            setListStructure([
                { subst1: 0 },
                {
                    // Start at the first word with a genitive, or end at the end of the "dictionary"-array
                    subst2: props.dictionary.findIndex(wordObj => wordObj.genitive !== null) > -1 ?
                        props.dictionary.findIndex(wordObj => wordObj.genitive !== null) :
                        props.dictionary.length
                }
            ]);
            props.onRerender();
        }
    }, [props.dictionary, props.shouldRerender]);

    return (
        <div className="vocabularium-list-grids-container">
            {listStructure.map((part, i) => {
                const partName = Object.keys(part)[0];
                const breakpoint = Object.values(part)[0];
                const nextPartBreakpoint = listStructure[i + 1] !== undefined ? Object.values(listStructure[i + 1])[0] : props.dictionary.length;
                return (
                    <div className={`vocabularium-list-grid vocabularium-list-${partName}`} key={`${part}-${i}`}>
                        {partName === "subst1" && (
                            <h1>Substantieven eerste vervoeging</h1>
                        )}
                        {partName === "subst2" && (
                            <h1>Substantieven tweede vervoeging</h1>
                        )}
                        <>
                            <div className={`section-header ${partName}-header`}>
                                {partName === "subst1" && (
                                    <>
                                        <p>#</p>
                                        <p>Woord</p>
                                        <p>Genus</p>
                                        <p>Vertaling</p>
                                        <p>Pagina</p>
                                    </>
                                )}
                                {partName === "subst2" && (
                                    <>
                                        <p>#</p>
                                        <p>Woord</p>
                                        <p>Genitief</p>
                                        <p>Genus</p>
                                        <p>Vertaling</p>
                                        <p>Pagina</p>
                                    </>
                                )}
                            </div>
                            {props.dictionary.slice(breakpoint, nextPartBreakpoint).map((wordObj, i) => {
                                return (
                                    <div className={`word-item word-item-${partName}`} key={`word-item-${wordObj.word}`}>
                                        {
                                            (i !== 0 && props.editable) &&
                                            <button className="insert-button" onClick={() => props.bringUpInsertWordModal(i + 1)}>+</button>
                                        }
                                        {Object.entries(wordObj).map(([key, value]) => {
                                            if (value !== null) {
                                                let displayedParameter = value;
                                                if (key === 'word' || key === 'genitive') {
                                                    displayedParameter = Ariadne.toGreek(value);
                                                }
                                                if (key === 'genus') {
                                                    displayedParameter = Ariadne.renderGenus(value);
                                                }
                                                return <p key={key}>{displayedParameter}</p>
                                            };
                                        })}
                                        {props.editable && (
                                            <button className="edit-button" onClick={() => props.bringUpUpdateWordModal(breakpoint + i)}>
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </>
                    </div>
                );
            })}
        </div>
    )
}

export default VocabulariumListGridsContainer;