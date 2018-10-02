import React, { Component } from 'react';
import idGenerator from 'react-id-generator';
import './Form.css';

class EditCollectionForm extends Component {
  constructor(props) {
    super(props);

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

    const collectionColor = document.getElementById(this.colorId).value;

    this.props.handleData({ ...this.state, collectionColor });

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

        <div className='form-group'>
          <label htmlFor='collection-color'>Collection Color</label><br />
          <input type='color' name='collection-color' className='colorInput' id={this.colorId}></input>
        </div>

        <button type='submit'>Confirm</button>
      </form>
    );
  }
}

export default EditCollectionForm;