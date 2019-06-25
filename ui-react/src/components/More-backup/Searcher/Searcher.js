import React from "react";
import Selector from "../Selector/Selector";

class Searcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: ''
    };
    this.getData = this.getData.bind(this);
  }

  getData(value) {
    this.setState({
        data: value
    })
  }

  render() {
    return <Selector sendInformation={this.getData} working="true" />;
  }
}

export default Searcher;