import React, { useState, useEffect } from 'react';
import './More.css';
import Header from '../Header/Header';

function More() {
    const [authors, setAuthors] = useState([]);
    const [works, setWorks] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [availableWorks, setAvailableWorks] = useState([]);
    const [selectedWork, setSelectedWork] = useState('');
    const [reference, setReference] = useState();
    const [text, setText] = useState('');
    const [sentenceNum, setSentenceNum] = useState(0);

    // Fetching the works
    useEffect(() => {
        const fetchData = async () => {
            fetch('/db/works')
                .then(response => {
                    if (!response.ok) throw Error('Failed fetching data');
                    return response.json();
                })
                .then(jsonResponse => {
                    // Saving works and their properties to 'works' state
                    setWorks(jsonResponse.rows);
                    // Saving all the different authors to 'authors' array
                    jsonResponse.rows.forEach(row => {
                        const { author, author_code } = row;
                        if (authors.indexOf(author) === -1) {
                            setAuthors([...authors, { author, code: author_code }]);
                        }
                    })
                });
        }
        fetchData();
    }, []);

    const handleAuthorSelect = event => {
        const { value } = event.target;
        if (value) {
            setSelectedAuthor(authors[authors.findIndex(obj => obj.author === value)]);
        } else {
            setSelectedAuthor('');
        }
    }

    const updateAvailableWorks = () => {
        if (selectedAuthor) {
            if (Object.keys(works).length) {
                const authorsWorks = works.map(work => {
                    if (work.author === selectedAuthor.author) {
                        return work.work;
                    }
                })
                setAvailableWorks(authorsWorks);
            }
        } else {
            setAvailableWorks([]);
        }
    }

    useEffect(updateAvailableWorks, [selectedAuthor]);

    const handleWorkSelect = event => {
        const { value } = event.target;
        if (value) {
            setSelectedWork(works[works.findIndex(work => work.work === value)]);
        } else {
            setSelectedWork('');
        }
    }

    const retrieveText = () => {
        const verifyParams = () => {
            return Object.keys(selectedAuthor).length && Object.keys(selectedWork).length && reference;
        }
        const parseXML = xml => {
            const parsedXML = xml
                .split(/<\/?div1.*>/g)[1]
                .replace(/<milestone.*\/>/g, '')
                .replace(/<\/?l.{0,8}>/g, '')
                .replace(/\n/g, '')
                .split(/[.;:]/g);
            return parsedXML;
        }
        if (!verifyParams()) throw Error('Incomplete input');
        const referenceParams = reference.split('.');
        const path = selectedWork.path.split(':');
        const getParams = () => {
            if (!referenceParams.length === path.length) throw Error('Wrong parameter syntax');
            const params = [];
            referenceParams.forEach((reference, i) => {
                params[i] = path[i] + reference;
            })
            return params.join(':');
        }
        const params = getParams();
        fetch(`http://www.perseus.tufts.edu/hopper/xmlchunk?doc=Perseus:text:${selectedAuthor.code}.${selectedWork.work_code}:${params}`)
            .then(response => {
                if (!response.ok) throw Error(`Request rejected by API: ${response.status} ${response.statusText}`);
                return response.text();
            })
            .then(textResponse => setText(parseXML(textResponse)));
    }

    const navigateBack = () => {
        if (sentenceNum > 0) {
            setSentenceNum(sentenceNum - 1);
        }
    }

    const navigateForward = () => {
        if (sentenceNum < text.length) {
            setSentenceNum(sentenceNum + 1);
        }
    }

    return (
        <div className="more">
            <Header />
            <h1 className="title">(Ἡδε ἡ χάρτη ἔτι κατασκευάζεται)</h1>
            <select onChange={handleAuthorSelect}>
                <option value="">(Selecteer een auteur)</option>
                {authors.map(author => <option value={author.author} key={`author-option-${author.author}`}>{author.author}</option>)}
            </select>
            <select onChange={handleWorkSelect}>
                <option value="">(Selecteer een werk)</option>
                {availableWorks.map(work => <option value={work} key={`work-option-${work}`}>{work}</option>)}
            </select>
            <input type="text" onChange={e => setReference(e.target.value)} placeholder="Geef een referentie op" />
            <button className="retrieve-text-btn" onClick={retrieveText}>Toon werk</button>
            {text ?
                <>
                    <div className="text">{text[sentenceNum]}</div>
                    <div className="btn-row">
                        <button className="prev-btn" onClick={navigateBack}>
                            <i className="far fa-arrow-alt-circle-left" />
                        </button>
                        <button className="next-btn" onClick={navigateForward}>
                            <i className="far fa-arrow-alt-circle-right" />
                        </button>
                    </div>
                </>
                : ''}
        </div>
    );
}

export default More;