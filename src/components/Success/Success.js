import React, { Component } from 'react';
import './Success.css';

class Success extends Component {
  render() {
    const { message } = this.props;

    if (message) {
      return (
        <div className="success-container">
          <p className="success">{message}</p>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Success;