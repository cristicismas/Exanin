import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchExpenses, newExpense, updateExpense, removeExpense } from '../../store/actions/expenses';
import { fetchIncomes, newIncome, updateIncome, removeIncome } from '../../store/actions/incomes';
import { removeError, addError } from '../../store/actions/errors';
import './Exchanges.css';

import Expenses from '../../components/Expenses/Expenses';
import Incomes from '../../components/Incomes/Incomes';

class Exchanges extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showExpenses: true
    };
  }

  render() {
    const { showExpenses } = this.state;
    const { collections } = this.props;

    if (collections.length) {
      return (
        <section id="exchanges">
          <div className="section-title">
            <button onClick={() => this.setState({ showExpenses: true })}>Expenses</button>
            <button onClick={() => this.setState({ showExpenses: false })}>Incomes</button>
          </div>
  
          <hr />
  
          {
            showExpenses ? 
            <Expenses {...this.props} /> : 
            <Incomes {...this.props} />
          }
  
        </section>
      );
    } else return null;
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    collections: state.collectionsData.collections,
    expenses: state.expenses,
    incomes: state.incomes,
    errors: state.errors
  }
}

export default connect(mapStateToProps, { fetchExpenses, newExpense, updateExpense, removeExpense, fetchIncomes, newIncome, updateIncome, removeIncome, removeError, addError })(Exchanges);