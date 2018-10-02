import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { COLORS } from '../../constants/Colors';
import './TransactionsOverview.css';

import Tip from '../Tip/Tip';

class TransactionsOverview extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentMonthIncomes: 0,
      currentMonthSavings: 0,
      currentMonthExpenses: 0,
      incomesChartDatasets: { backgroundColor: [], data: [] },
      incomesChartLabels: [],
      expensesChartDatasets: { backgroundColor: [], data: [] },
      expensesChartLabels: [],
      hasEnoughDataForDisplay: false
    };

    this.fetchAllData = this.fetchAllData.bind(this);
    this.getOverviewValues = this.getOverviewValues.bind(this);
  }

  componentDidMount() {
    this.fetchAllData();
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.expenses !== this.props.expenses || nextprops.incomes !== this.props.incomes || !this.compareCollections(this.props.collections, nextprops.collections)) {
      this.fetchAllData();
    }
  }

  fetchAllData() {
    const userId = this.props.currentUser.user.id;
    const currentMonthIndex = new Date().getMonth();

    this.props.dataFetched(false);

    this.props.fetchCollectionsAndValuesForMonth(userId, currentMonthIndex)
      .then(() => {
        this.props.fetchCollectionsAndValues(userId);
      })
      .then(() => {
        const { collectionsAndValues } = this.props;

        Object.keys(collectionsAndValues).forEach(collectionName => {
          if (collectionsAndValues[collectionName].value > 0) {
            this.setState({ hasEnoughDataForDisplay: true });
          }
        });
      })
      .then(() => {
        this.getOverviewValues();
      })
      .then(() => {
        this.getChartDatasets();
      })
      .then(() => {
        this.props.dataFetched(true);
      })
  }

  compareCollections(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      let aProps = Object.getOwnPropertyNames(a[i]);

      for (let j = 0; j < aProps.length; j++) {
        let propName = aProps[j];
  
        if (a[i][propName] !== b[i][propName]) {
          return false;
        }
      }
    }

    return true;
  }

  getOverviewValues() {
    const { collectionsAndValuesForMonth } = this.props;

    let currentMonthExpenses = 0;
    let currentMonthIncomes = 0;

    Object.keys(collectionsAndValuesForMonth).forEach(collection => {
      if (collectionsAndValuesForMonth[collection].isExpense) {
        currentMonthExpenses += collectionsAndValuesForMonth[collection].value;
      } else {
        currentMonthIncomes += collectionsAndValuesForMonth[collection].value;
      }
    });

    const currentMonthSavings = currentMonthIncomes - currentMonthExpenses;

    this.setState({ currentMonthExpenses, currentMonthIncomes, currentMonthSavings });
  }

  getChartDatasets() {
    const { collectionsAndValuesForMonth } = this.props;
    let { expensesChartDatasets, expensesChartLabels, incomesChartDatasets, incomesChartLabels } = this.state;

    // Make sure these arrays are empty before pushing to them
    incomesChartDatasets.backgroundColor = [];
    incomesChartDatasets.data = [];

    expensesChartDatasets.backgroundColor = [];
    expensesChartDatasets.data = [];

    Object.keys(collectionsAndValuesForMonth).forEach(collection => {
      if (collectionsAndValuesForMonth[collection].isExpense) {
        expensesChartDatasets.backgroundColor.push(collectionsAndValuesForMonth[collection].color);
        expensesChartDatasets.data.push(collectionsAndValuesForMonth[collection].value);

        if (!expensesChartLabels.includes(collection)) {
          expensesChartLabels.push(collection);
        }
      } else {
        incomesChartDatasets.backgroundColor.push(collectionsAndValuesForMonth[collection].color);
        incomesChartDatasets.data.push(collectionsAndValuesForMonth[collection].value);

        if (!incomesChartLabels.includes(collection)) {
          incomesChartLabels.push(collection);
        }
      }
    });

    this.setState({ expensesChartDatasets, incomesChartDatasets });
  }

  render() {
    const { currentMonthIncomes, currentMonthSavings, currentMonthExpenses, incomesChartDatasets, expensesChartDatasets, incomesChartLabels, expensesChartLabels, hasEnoughDataForDisplay } = this.state;
    const { collections } = this.props;

    if (hasEnoughDataForDisplay) {
      return (
        <section id='transactions-overview'>
          <h2 className='section-title'>Overview</h2>
          <hr />

          <div className='transactions-overview-card' id='savings-card'>
            <p>Savings this month</p>
            {
              currentMonthSavings >= 0 ? 
              <h5 className='transactions-overview-value' style={{'color': COLORS.GREEN}}>{`+${currentMonthSavings}`}</h5> : 
              <h5 className='transactions-overview-value' style={{'color': COLORS.RED}}>{`${currentMonthSavings}`}</h5>
            }
            <div className='chart-container' id='incomes-chart'>
            </div>
          </div>

          <div className='transactions-overview-chart-group'>
            
            <div className='transactions-overview-card' id='incomes-card'>
              <p>Incomes this month</p>
              <h5 className='transactions-overview-value' style={{'color': COLORS.GREEN}}>+{currentMonthIncomes}</h5>
              <div className='chart-container' id='incomes-chart'>
                <Doughnut 
                  data={{
                    datasets: [{ backgroundColor: [...incomesChartDatasets.backgroundColor], data: [...incomesChartDatasets.data] }],
                    labels: [...incomesChartLabels]
                  }} />
              </div>
            </div>

            <div className='transactions-overview-card' id='expenses-card'>
              <p>Expenses this month</p>
              <h5 className='transactions-overview-value' style={{'color': COLORS.RED}}>-{currentMonthExpenses}</h5>
              <div className='chart-container' id='incomes-chart'>
                <Doughnut 
                  data={{
                    datasets: [{ backgroundColor: [...expensesChartDatasets.backgroundColor], data: [...expensesChartDatasets.data] }],
                    labels: [...expensesChartLabels]
                  }} />
              </div>
            </div>

          </div>
        </section>
      );
    } else if (collections.length) {
      return (
        <Tip message='For more advanced charts please add some more data (collections, expenses and incomes).'/>
      );
    } else {
      return null;
    }
  }
}

export default TransactionsOverview;