import React, { Component } from 'react';
import { COLORS } from '../../constants/Colors';
import { ICONS } from '../../constants/Icons';
import './Incomes.css';

import Dropdown from '../Dropdown/Dropdown';
import TransactionForm from '../Form/TransactionForm';
import Overlay from '../Overlay/Overlay';
import Icon from '../Icon/Icon';
import Tip from '../Tip/Tip';

class Incomes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteConfirmation: false,
      incomeToDelete: '',
      showEditIncomeDialog: false,
      incomeToEdit: '',
      canAddIncome: false
    };

    this.handleFetchIncomes = this.handleFetchIncomes.bind(this);
    this.handleRemoveIncome = this.handleRemoveIncome.bind(this);
    this.handleAddIncome = this.handleAddIncome.bind(this);
    this.handleEditIncome = this.handleEditIncome.bind(this);
  }

  // Check for incomes collections to figure out if addCollection form should be displayed.
  componentDidMount() {
    if (this.props.collections.length) {
      for (let i = 0; i < this.props.collections.length; i++) {
        if (!this.props.collections[i].isExpense) {
          this.setState({ canAddIncome: true });
        }
      }
    }
  }

  // Check for incomes collections to figure out if addCollection form should be displayed.
  componentWillReceiveProps(nextProps) {
    if (nextProps.collections !== this.props.collections && nextProps.collections.length) {
      for (let i = 0; i < nextProps.collections.length; i++) {
        if (!nextProps.collections[i].isExpense) {
          this.setState({ canAddIncome: true });
        }
      }
    }
  }

  handleFetchIncomes() {
    this.props.fetchIncomes(this.props.currentUser.user.id)
      .then(() => {
        this.props.dataFetched(true);
      });
  }

  handleRemoveIncome(income_id) {
    this.props.dataFetched(false);
    this.props.removeIncome(this.props.currentUser.user.id, income_id)
      .then(() => {
        this.props.dataFetched(true);
      });
  }

  handleAddIncome(collectionId, income) {
    this.props.dataFetched(false);
    this.props.newIncome(collectionId, income)
      .then(() => {
        this.props.dataFetched(true);
      });
  }

  handleEditIncome(collectionId, income) {
    const incomeId = this.state.incomeToEdit;

    this.props.dataFetched(false);
    this.props.updateIncome(collectionId, incomeId, income)
      .then(() => {
        this.setState({ showEditIncomeDialog: false, incomeToEdit: '' });
        this.props.dataFetched(true);
      });
  }

  render() {
    const { showDeleteConfirmation, incomeToDelete, showEditIncomeDialog, canAddIncome } = this.state;
    const { incomes, collections } = this.props;

    const incomesList = incomes.map(income => {
      
      const collectionId = income._collection;
      const collection = collections.find(coll => coll._id === collectionId);

      return (
        <li className="exchange-item" key={income._id}>
          <div className="exchange-content">
            <p className="exchange-title">{income.title}</p>
            <p className="exchange-collection">{collection ? collection.title : ''}</p>
            <p className="exchange-collection">{income.transactionDate}</p>
            <p className="exchange-value">+{income.value}</p>
            <div>
              <button onClick={() => this.setState({ showEditIncomeDialog: true, incomeToEdit: income._id })}>
                <Icon icon={ICONS.EDIT} color={COLORS.GRAY} size='20' />
              </button>
              <button onClick={() => this.setState({ showDeleteConfirmation: true, incomeToDelete: income._id })}>
                <Icon icon={ICONS.DELETE} color='rgb(255, 0, 0)' size='20' />
              </button>
            </div>
          </div>
          <hr />
        </li>
      );
    });

    const incomeCollections = collections.filter(collection => !collection.isExpense);

    const collectionOptions = incomeCollections.map(collection => (
      <option value={collection._id} key={collection._id}>{collection.title}</option>
    ));

    const DeleteConfirmation = () => (
      <div className='confirmation'>
        <h3 className='confirmation-title'>Are you sure you want to delete this income?</h3>
        <div className='confirmation-btn-group'>
          <button className='confirmation-btn confirmation-btn-danger' onClick={() => {
            this.setState({ showDeleteConfirmation: false, incomeToDelete: '' });
            this.handleRemoveIncome(incomeToDelete);
          }}>Confirm</button>
        </div>
      </div>
    );

    return (
      <div id="incomes">
        {
          canAddIncome ?
          (
          <Dropdown
            title="Add Income"
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
              handleData={this.handleAddIncome} />
            } />
          ) : 
          <Tip message="Please add an incomes collection before adding incomes."/>
        }

        {
          incomes.length ?
          (
            <div className="exchanges-list-labels">
              <p>Income Title</p>
              <p>Collection</p>
              <p>Date</p>
              <p>Value</p>
              <p>Actions</p>
            </div>
          ) :
          null
        }

        <ul className="incomes-list">
          {incomesList}
        </ul>

        {
          showEditIncomeDialog ?
          <Overlay 
            maxWidth={"70%"}
            closeOverlay={() => this.setState({ showEditIncomeDialog: false })}
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
                handleData={this.handleEditIncome} /> } /> :
          null
        }

        {
          showDeleteConfirmation ?
          <Overlay
            content={<DeleteConfirmation />}
            closeOverlay={() => this.setState({ showDeleteConfirmation: false, incomeToDelete: '' })}
            maxWidth="30%" /> :
          null
        }
      </div>
    );
  }
    
}

export default Incomes;