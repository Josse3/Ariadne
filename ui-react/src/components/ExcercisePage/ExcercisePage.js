import React from 'react';

class ExcercisePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dictionary: {}
        }
        this.fetchData = this.fetchData.bind(this);
    }

    async fetchData(pageStart, pageEnd) {
        if (pageStart && pageEnd) {
            const data = await fetch('/api/searchSpecific/pageStart/pageEnd').then(response => {
                if (response.ok) {
                    return response.json();
                }
            });
            this.setState({ dictionary: data });
        } else {
            const data = await fetch('/api/search/').then(response => response.json());
            this.setState({ dictionary: data });
        }
    }
}

export default ExcercisePage;