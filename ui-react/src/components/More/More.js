import React from 'react';
import './More.css';
import Header from '../Header/Header';
import Searcher from './Searcher/Searcher';
import Selector from './Selector/Selector';

class More extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="more">
                <Header />
                <div className="content">
                    <Selector />
                </div>
            </div>
        )
    }
}

export default More;