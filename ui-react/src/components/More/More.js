import React, { useState, useEffect } from 'react';
import './More.css';
import Header from '../Header/Header';

function More() {
    const [authors, setAuthors] = useState([]);
    const [works, setWorks] = useState({});
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [availableWorks, setAvailableWorks] = useState([]);

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
                        const { author, work_code } = row;
                        if (authors.indexOf(author) === -1) {
                            setAuthors([...authors, { author, code: work_code }]);
                        }
                    })
                });
        }
        fetchData();
    }, []);

    const handleAuthorSelect = event => {
        const { value } = event.target;
        if (value) {
            setSelectedAuthor(value);
        } else {
            setSelectedAuthor('');
        }
    }

    const updateAvailableWorks = () => {
        if (selectedAuthor) {
            if (Object.keys(works).length) {
                const authorsWorks = works.map(work => {
                    if (work.author === selectedAuthor) {
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

    return (
        <div className="more">
            <Header />
            <h1 className="title">(Ἡδε ἡ χάρτη ἔτι κατασκευάζεται)</h1>
            <select onChange={handleAuthorSelect}>
                <option value="">(Selecteer een auteur)</option>
                {authors.map(author => <option value={author.author} key={`author-option-${author.author}`}>{author.author}</option>)}
            </select>
            <select>
                <option value="">(Selecteer een werk)</option>
                {availableWorks.map(work => <option value={work} key={`work-option-${work}`}>{work}</option>)}
            </select>
        </div>
    );
}

export default More;