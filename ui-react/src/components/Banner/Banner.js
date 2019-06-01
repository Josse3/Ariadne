import React from 'react';
import './Banner.css';

class Banner extends React.Component {
  render() {
    return (
      <h1 className="banner-header">{this.props.text ? this.props.text : 'Ἀριάδνη'}</h1>
    );
  }
}

export default Banner;
