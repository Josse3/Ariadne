import React from 'react';
import { Link } from 'react-router-dom';
import './Navbox.css';

class Navbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: this.props.backgroundColor,
      href: `/${this.props.href}`
    };
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleMouseOver() {
    this.setState({
      backgroundColor: this.props.highlightColor
    })
  }

  handleMouseOut() {
    this.setState({
      backgroundColor: this.props.backgroundColor
    })
  }

  render() {
    return (
      <div className="navbox-container">
        <Link to={this.state.href}>
          <div className="navbox-content" style={{
            backgroundColor: this.state.backgroundColor,
            backgroundImage: `url(${this.props.backgroundImage})`
          }} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
            <h1>{this.props.header}</h1>
            <p>{this.props.description}</p>
          </div>
        </Link>
      </div>
    )
  }
}

export default Navbox;
