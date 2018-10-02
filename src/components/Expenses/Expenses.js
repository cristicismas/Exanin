import React, { Component } from 'react';
import { COLORS } from '../../constants/Colors';
import { ICONS } from '../../constants/Icons';
import './Expenses.css';

import Dropdown from '../Dropdown/Dropdown';
import TransactionForm from '../Form/TransactionForm';
import Overlay from '../Overlay/Overlay';
import Icon from '../Icon/Icon';
import Tip from '../Tip/Tip';

class Expenses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteConfirmation: false,
      expenseToDelete: '',
      showEditExpenseDialog: false,
      expenseToEdit: '',
      canAddExpense: false
    };

    this.handleFetchExpenses = this.handleFetchExpenses.bind(this);
    this.handleRemoveExpense = this.handleRemoveExpense.bind(this);
    this.handleAddExpense = this.handleAddExpense.bind(this);
    this.handleEditExpense = this.handleEditExpense.bind(this);
  }

  // Check for expenses collections to figure out if addCollection form should be displayed.
  componentDidMount() {
    if (this.props.collections.length) {
      for (let i = 0; i < this.props.collections.length; i++) {
        if (this.props.collections[i].isExpense) {
          this.setState({ canAddExpense: true });
        }
      }
    }
  }

  // Check for expenses collections to figure out if addCollection form should be displayed.
  componentWillReceiveProps(nextProps) {
    if (nextProps.collections !== this.props.collections && nextProps.collections.length) {
      for (let i = 0; i < nextProps.collections.length; i++) {
        if (nextProps.collections[i].isExpense) {
          this.setState({ canAddExpense: true });
        }
      }
    }
  }

  handleFetchExpenses() {
    this.props.fetchExpenses(this.props.currentUser.user.id)
      .then(() => {
        this.props.dataFetched(true);
      });
  }

  handleRemoveExpense(expense_id) {
    this.props.dataFetched(false);
    this.props.removeExpense(this.props.currentUser.user.id, expense_id)
      .then(() => {
        this.props.dataFetched(true);
      });
  }

  handleAddExpense(collectionId, expense) {
    this.props.dataFetched(false);
    this.props.newExpense(collectionId, expense)
      .then(() => {
        this.props.dataFetched(true);
      });
  }

  handleEditExpense(collectionId, expense) {
    const expenseId = this.state.expenseToEdit;

    this.props.dataFetched(false);
    this.props.updateExpense(collectionId, expenseId, expense)
      .then(() => {
        this.setState({ showEditExpenseDialog: false, expenseToEdit: '' });
        this.props.dataFetched(true);
      });
  }

  render() {
    const { showDeleteConfirmation, expenseToDelete, showEditExpenseDialog, canAddExpense } = this.state;
    const { expenses, collections } = this.props;

    const expensesList = expenses.map(expense => {
      
      const collectionId = expense._collection;
      const collection = collections.find(coll => coll._id === collectionId);

      return (
        <li className="exchange-item" key={expense._id}>
          <div className="exchange-content">
            <p className="exchange-title">{expense.title}</p>
            <p className="exchange-collection">{collection ? collection.title : ''}</p>
            <p className="exchange-collection">{expense.transactionDate}</p>
            <p className="exchange-value">-{expense.value}</p>
            <div>
              <button onClick={() => this.setState({ showEditExpenseDialog: true, expenseToEdit: expense._id })}>
                <Icon icon={ICONS.EDIT} color={COLORS.GRAY} size='20' />
              </button>
              <button onClick={() => this.setState({ showDeleteConfirmation: true, expenseToDelete: expense._id })}>
                <Icon icon={ICONS.DELETE} color='rgb(255, 0, 0)' size='20' />
              </button>
            </div>
          </div>
          <hr />
        </li>
      );
    });

    const expenseCollections = collections.filter(collection => collection.isExpense);
    
    const collectionOptions = expenseCollections.map(collection => (
      <option value={collection._id} key={collection._id}>{collection.title}</option>
    ));

    const DeleteConfirmation = () => (
      <div className='confirmation'>
        <h3 className='confirmation-title'>Are you sure you want to delete this expense?</h3>
        <div className='confirmation-btn-group'>
          <button className='confirmation-btn confirmation-btn-danger' onClick={() => {
            this.setState({ showDeleteConfirmation: false, expenseToDelete: '' });
            this.handleRemoveExpense(expenseToDelete);
          }}>Confirm</button>
        </div>
      </div>
    );

    return (
      <div id="expenses">
        {
          canAddExpense ? 
          (
            <Dropdown
              title="Add Expense"
              items={
              <TransactionForm 
                history={this.props.history}
                removeError={this.props.removeError}
                firstLabel={"Title"}
                firstInputPlaceholder={"eg. Grocery Receipt"}
                secondLabel={"Value"}
                secondInputPlaceholder={"eg. 115"}
                thirdLabel={"Collection"}
                options={collectionOptions}
                handleData={this.handleAddExpense} />
              } />
          ) : 
          <Tip message="Please add an expenses collection before adding expenses."/>
        }

        {
          expenses.length ?
          (
            <div className="exchanges-list-labels">
              <p>Expense Title</p>
              <p>Collection</p>
              <p>Date</p>
              <p>Value</p>
              <p>Actions</p>
            </div>
          ) :
          null
        }

        <ul className="expenses-list">
          {expensesList}
        </ul>

        {
          showEditExpenseDialog ?
          <Overlay 
            maxWidth={"70%"}
            closeOverlay={() => this.setState({ showEditExpenseDialog: false })}
            content={
              <TransactionForm 
                history={this.props.history}
                removeError={this.props.removeError}
                firstLabel={"Title"}
                firstInputPlaceholder={"eg. Grocery Receipt"}
                secondLabel={"Value"}
                secondInputPlaceholder={"eg. 115"}
                thirdLabel={"Collection"}
                options={collectionOptions}
                handleData={this.handleEditExpense} /> } /> :
          null
        }

        {
          showDeleteConfirmation ?
          <Overlay
            content={<DeleteConfirmation />}
            closeOverlay={() => this.setState({ showDeleteConfirmation: false, expenseToDelete: '' })}
            maxWidth="30%" /> :
          null
        }
      </div>
    );
  }
    
}

export default Expenses;