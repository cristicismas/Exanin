import React, { Component } from 'react';
import idGenerator from 'react-id-generator';
import './Form.css';

class TransactionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      monthRangeValue: 1
    };

    this.rangeSliderId = idGenerator();

    this.getCurrentDate = this.getCurrentDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ transactionDate: this.getCurrentDate() });
  }

  componentDidUpdate() {
    if (!this.state.transactionDate) {
      this.setState({ transactionDate: this.getCurrentDate() });
    }
  }

  getCurrentDate() {
    let today = new Date();
    let month = '' + (today.getMonth() + 1);
    let day = '' + today.getDate();
    let year = today.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    // Get collection id
    const selectInput = document.getElementById('select');
    const collectionId = selectInput.options[selectInput.selectedIndex].value;

    this.props.handleData(collectionId, this.state);

    // Clear all input values
    this.setState({ title: '', value: 0, transactionDate: '' });

    const titleInputs = document.getElementsByClassName('titleInput');
    for (let i = 0; i < titleInputs.length; i++) {
      titleInputs[i].value = '';
    }

    const valueInputs = document.getElementsByClassName('valueInput');
    for (let i = 0; i < valueInputs.length; i++) {
      valueInputs[i].value = '';
    }
  }

  render() {
    const {
      history,
      removeError,
      formTitle,
      firstLabel,
      secondLabel,
      thirdLabel,
      firstInputPlaceholder,
      secondInputPlaceholder,
      options,
    } = this.props;

    history.listen(() => {
      removeError();
    });

    const currentYear = new Date().getFullYear();

    return (
      <div className='form-container'>
        <h2 className='form-title'>{formTitle}</h2>
        <form className='form' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='title'>{firstLabel}</label><br />
            <input
              className='titleInput'
              type='text'
              name='title'
              placeholder={firstInputPlaceholder || 'eg. Rent'}
              autoComplete='off'
              autoCorrect='off'
              required
              onChange={this.handleChange} />
          </div>

          <div className='form-group'>
            <label htmlFor='value'>{secondLabel}</label><br />
            <input
              className='valueInput'
              type='number'
              name='value'
              maxLength='15'
              placeholder={secondInputPlaceholder || 'eg. 5200'}
              autoComplete='off'
              autoCorrect='off'
              required
              onChange={this.handleChange} />
          </div>

          <div className='form-group'>
            <label htmlFor='transactionDate'>Date</label><br />
            <input
              type='date'
              name='transactionDate'
              id='transactionDate'
              min={`${currentYear}-01-01`}
              max={`${currentYear}-12-31`}
              value={this.state.transactionDate || this.getCurrentDate()}
              onChange={this.handleChange} />
          </div>

          <div className='slider-group'>
            <label htmlFor='range-slider'>Month Range: {this.state.monthRangeValue}</label><br />
            <input type="range" name='monthRangeValue' min="1" max="12" value={this.state.monthRangeValue} className="monthRange" onChange={this.handleChange} />
          </div>

          <div className='form-group'>
            <label htmlFor='select'>{thirdLabel}</label><br />
            <select name='select' id='select'>
              {options}
            </select>
          </div>

          <button type='submit'>Confirm</button>
        </form>
      </div>
    );
  }
}

export default TransactionForm;