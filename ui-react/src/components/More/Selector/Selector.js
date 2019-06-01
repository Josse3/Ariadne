import React from "react";
import "./Selector.css";

class Selector extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {};

    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  handleChange(event) {
    const { value, name } = event.target;
    const pushData = (category, data) => {
      if (category === "author") {
        return { author: data };
      } else if (category === "work") {
        return { work: data };
      } else {
        throw Error("Unknown value");
      }
    };

    try {
      this.setState(pushData(name, value));
    } catch (err) {
      console.error(err);
      // TODO: Error handling
    }
  }

  sendData() {
      const data = this.state;
      console.log(data.author);
      console.log(this.props.sendInformation);
      this.props.sendInformation(data.author);
  }

  render() {
    console.log(this.props);
    console.log(this.props.working);
    const works = {
      herodotus: ["historiae"],
      xenophon: ["anabasis", "memorabilia"]
    };

    return (
        <div className="selector">
            <form className="select-work" onChange={this.handleChange}>
            <select name="author">
                {Object.keys(works).map(author => {
                    return (
                    <option value={author} key={`option_${author}`}>
                        {author}
                    </option>
                    );
                })}
            </select>
            <select name="work">
                {works[this.state.author ? this.state.author : "herodotus"].map(work => {
                    return (
                        <option value={work} key={`option_${work}`}>
                        {work}
                        </option>
                    );
                    }
                )}
            </select>
        </form>
        <button name="confirm" className="btn-submit" onClick={this.sendData}>
            Bevestigen
        </button>
    </div>
    );
  }
}

export default Selector;
