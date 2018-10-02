import React, { Component } from 'react';
import idGenerator from 'react-id-generator';
import './Form.css';

class CollectionForm extends Component {
  constructor(props) {
    super(props);

    this.switchId = idGenerator();
    this.colorId = idGenerator();

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
    
    const switchButton = document.getElementById(this.switchId);
    const isExpense = !switchButton.checked;

    const collectionColor = document.getElementById(this.colorId).value;

    this.props.handleData({ ...this.state, isExpense, collectionColor });

    this.setState({ title: '' });
    const titleInput = document.getElementById('titleInput');
    titleInput.value = '';
  }

  render() {
    const { history, removeError, firstLabel, firstInputPlaceholder } = this.props;

    history.listen(() => {
      removeError();
    });

    return (
      <form className='form form-small' onSubmit={this.handleSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>{firstLabel}</label><br/>
          <input
            id='titleInput'
            type='text'
            name='title'
            placeholder={firstInputPlaceholder || 'eg. Rent'}
            autoComplete='off' 
            autoCorrect='off' 
            required
            onChange={this.handleChange} />
        </div>

        <div className='form-group switch-group'>
          <label htmlFor='onoffswitch'>Collection Type</label>
          <div className='onoffswitch'>
            <input type='checkbox' name='onoffswitch' className='onoffswitch-checkbox' id={this.switchId} />
            <label className='onoffswitch-label' htmlFor={this.switchId}>
              <span className='onoffswitch-inner'></span>
              <span className='onoffswitch-switch'></span>
            </label>
          </div>
        </div>

        <div className='form-group'>
          <label htmlFor='collection-color'>Collection Color</label><br />
          <input type='color' name='collection-color' className='colorInput' id={this.colorId}></input>
        </div>

        <button type='submit'>Confirm</button>
      </form>
    );
  }
}

export default CollectionForm;