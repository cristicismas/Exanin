import React, { Component } from 'react';
import './Tip.css';

class Tip extends Component {
  render() {
    const { message } = this.props;

    if (message) {
      return (
        <div className="tip-container">
          <p className="tip">{message}</p>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Tip;