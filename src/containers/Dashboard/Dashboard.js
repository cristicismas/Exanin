import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCollections, fetchCollectionsChartData, fetchCollectionsAndValues, fetchCollectionsAndValuesForMonth, newCollection, removeCollection, updateCollection } from '../../store/actions/collections';
import { fetchExpenses } from '../../store/actions/expenses';
import { fetchIncomes } from '../../store/actions/incomes';
import { removeError, addError } from '../../store/actions/errors';
import './Dashboard.css';

import TransactionsOverview from '../../components/TransactionsOverview/TransactionsOverview';
import Collections from '../../components/Collections/Collections';
import Exchanges from '../Exchanges/Exchanges';
import Loading from '../../components/Loading/Loading';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isDataFetched: false
    };

    this.dataFetched = this.dataFetched.bind(this);
  }

  componentDidMount() {
    const userId = this.props.currentUser.user.id;

    // Make sure to fetch everything when dashboard mounts.
    this.dataFetched(false);
    
    this.props.fetchExpenses(userId)
      .then(() => {
        this.props.fetchIncomes(userId)
      })
      .then(() => {
        this.dataFetched(true);
      });
  }

  componentDidUpdate(prevProps) {
    const userId = this.props.currentUser.user.id;

    // If a collection is removed, make sure the client requests the expenses and incomes again as some might already be gone.
    if (prevProps.collections.length > this.props.collections.length) {
      this.dataFetched(false);
      this.props.fetchExpenses(userId)
        .then(() => {
          this.props.fetchIncomes(userId);
        })
        .then(() => {
          this.dataFetched(true);
        })
    }
  }

  dataFetched(boolean) {
    this.setState({ isDataFetched: boolean });
  }
  
  render() {
    return (
      <div id="dashboard">
        <TransactionsOverview 
          dataFetched={this.dataFetched}
          {...this.props} />

        <Collections 
          dataFetched={this.dataFetched}
          {...this.props} />

        <Exchanges 
          history={this.props.history}
          dataFetched={this.dataFetched} 
          isDataFetched={this.state.isDataFetched} />

        {
          !this.state.isDataFetched ?
          (<Loading />) :
          null
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    collections: state.collectionsData.collections,
    collectionsChartData: state.collectionsData.collectionsChartData,
    collectionsAndValues: state.collectionsData.collectionsAndValues,
    collectionsAndValuesForMonth: state.collectionsData.collectionsAndValuesForMonth,
    expenses: state.expenses,
    incomes: state.incomes,
    errors: state.errors
  };
}

export default connect(mapStateToProps, { fetchCollections, fetchCollectionsChartData, fetchCollectionsAndValues, fetchCollectionsAndValuesForMonth, newCollection, removeCollection, updateCollection, fetchExpenses, fetchIncomes, removeError, addError })(Dashboard);