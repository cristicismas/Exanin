import React, { Component } from 'react';
import './Error.css';

class Error extends Component {
  render() {
    const { errors } = this.props;

    if (errors.message) {
      return (
        <div className="error-container">
          <p className="error">{errors.message}</p>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Error;