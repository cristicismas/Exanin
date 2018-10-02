import React, { Component } from 'react';
import './Form.css';

import Error from '../Error/Error';

class AuthForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleData(this.state);
  }

  render() {
    const { history, removeError, formTitle, firstLabel, secondLabel, firstInputPlaceholder, secondInputPlaceholder, errors } = this.props;

    history.listen(() => {
      removeError();
    });

    return (
      <div className='form-container'>
        <hr />
        <h2 className="form-title">{formTitle}</h2>

        <Error errors={errors} />

        <form className='form' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='email'>{firstLabel}</label><br/>
            <input 
              type='email' 
              id='email' 
              name='email' 
              placeholder={firstInputPlaceholder || 'example@me.com'}
              autoComplete='off' 
              autoCorrect='off' 
              required 
              onChange={this.handleChange} />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>{secondLabel}</label><br/>
            <input
              type='password' 
              id='password' 
              name='password' 
              minLength='5' 
              maxLength='25' 
              placeholder={secondInputPlaceholder || 'Min. 5 characters'}
              autoComplete='off' 
              autoCorrect='off' 
              required 
              onChange={this.handleChange} />
          </div>

          <button type='submit'>Confirm</button>
        </form>
      </div>
    );
  }
}

export default AuthForm;