import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { COLORS } from '../../constants/Colors';
import { CHART_TYPES } from '../../constants/ChartTypes';
import { ALL_MONTHS } from '../../constants/Months';
import './CollectionsChart.css';

class CollectionsChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortedMonths: [],
      renderOnChart: CHART_TYPES.EXPENSES_AND_INCOMES,
      timePeriod: 12
    };

    this.setDatasets = this.setDatasets.bind(this);
    this.sortMonths = this.sortMonths.bind(this);
  }

  componentDidMount() {
    this.props.dataFetched(false);
    this.props.fetchCollectionsChartData(this.props.currentUser.user.id, this.state.renderOnChart)
      .then(() => {
        this.sortMonths();
      })
      .then(() => {
        this.setDatasets();
      })
      .then(() => {
        this.props.dataFetched(true);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.expenses !== this.props.expenses || prevProps.incomes !== this.props.incomes || prevState.timePeriod !== this.state.timePeriod || prevState.renderOnChart !== this.state.renderOnChart) {
      this.props.dataFetched(false);
      this.props.fetchCollectionsChartData(this.props.currentUser.user.id, this.state.renderOnChart)
        .then(() => {
          this.sortMonths();
        })
        .then(() => {
          this.setDatasets();
        })
        .then(() => {
          this.props.dataFetched(true);
        });
    }
  }

  // Sorts months starting from the first recorded transaction.
  sortMonths() {
    const { renderOnChart } = this.state;

    let chartMonths = [];

    if (renderOnChart === CHART_TYPES.EXPENSES_AND_INCOMES) {
      chartMonths = this.sortExpensesAndIncomesMonths();
    } else if (renderOnChart === CHART_TYPES.ALL_COLLECTIONS) {
      chartMonths = this.sortAllCollectionsMonths();
    }

    this.setState({ chartMonths });
  }

  sortExpensesAndIncomesMonths() {
    const { timePeriod } = this.state;
    const { collectionsChartData } = this.props;

    const expensesMonths = collectionsChartData.expensesData;
    const incomesMonths = collectionsChartData.incomesData;

    let firstTransactionIndex = 0;
    let lastTransactionIndex = 0;
    
    // Loop through all months, find the first expense or income, and store it's index.
    for (let i = 0; i < ALL_MONTHS.length; i++) {
      if (expensesMonths[ALL_MONTHS[i]] > 0 || incomesMonths[ALL_MONTHS[i]] > 0) {
        firstTransactionIndex = i;
        break;
      }
    }

    // Loop through all months in reverse, find the last expense or income, and store it's index.
    for (let i = ALL_MONTHS.length; i > 0; i--) {
      if (expensesMonths[ALL_MONTHS[i]] > 0 || incomesMonths[ALL_MONTHS[i]] > 0) {
        lastTransactionIndex = i;
        break;
      }
    }

    let sortedMonths = [];

    // Push all months after the first transaction index.
    for (let i = firstTransactionIndex; i < ALL_MONTHS.length; i++) {
      sortedMonths.push(ALL_MONTHS[i]);
    }

    // Push all months before the first transaction index.
    for (let i = 0; i < firstTransactionIndex; i++) {
      sortedMonths.push(ALL_MONTHS[i]);
    }

    const numberOfTransactionMonths = lastTransactionIndex - firstTransactionIndex + 1;
    let chartMonths = [];

    if (numberOfTransactionMonths > timePeriod) {
      chartMonths = sortedMonths.slice(numberOfTransactionMonths - timePeriod, numberOfTransactionMonths);
    } else {
      chartMonths = sortedMonths.slice(0, timePeriod);
    }

    return chartMonths;
  }

  sortAllCollectionsMonths() {
    const { timePeriod } = this.state;
    const { collectionsChartData } = this.props;

    const chartCollections = Object.keys(collectionsChartData);
    let transactionsIndices = [];
    
    // Push each unique transaction index to an array so you can later extract the first and last transaction index.
    for (let collectionIndex = 0; collectionIndex < chartCollections.length; collectionIndex++) {
      const currentCollection = chartCollections[collectionIndex];

      for (let monthIndex = 0; monthIndex < ALL_MONTHS.length; monthIndex++) {
        const currentMonth = ALL_MONTHS[monthIndex];
        const currentMonthValue = collectionsChartData[currentCollection]['values'][currentMonth];

        if (currentMonthValue > 0 && !transactionsIndices.includes(monthIndex)) {
          transactionsIndices.push(monthIndex);
        }
      }
    }

    // Sort array by smallest to largest number
    transactionsIndices.sort((a, b) => a - b);
    
    const firstTransactionIndex = transactionsIndices[0];
    const lastTransactionIndex = transactionsIndices[transactionsIndices.length - 1];

    let sortedMonths = [];

    // Push all months after the first transaction index.
    for (let i = firstTransactionIndex; i < ALL_MONTHS.length; i++) {
      sortedMonths.push(ALL_MONTHS[i]);
    }

    // Push all months before the first transaction index.
    for (let i = 0; i < firstTransactionIndex; i++) {
      sortedMonths.push(ALL_MONTHS[i]);
    }

    const numberOfTransactionMonths = lastTransactionIndex - firstTransactionIndex + 1;
    let chartMonths = [];

    if (numberOfTransactionMonths > timePeriod) {
      chartMonths = sortedMonths.slice(numberOfTransactionMonths - timePeriod, numberOfTransactionMonths);
    } else {
      chartMonths = sortedMonths.slice(0, timePeriod);
    }

    return chartMonths;
  }

  setDatasets() {
    const { renderOnChart } = this.state;

    let datasets = [];

    if (renderOnChart === CHART_TYPES.EXPENSES_AND_INCOMES) {
      datasets = this.setExpensesAndIncomes();
    } else if (renderOnChart === CHART_TYPES.ALL_COLLECTIONS) {
      datasets = this.setAllCollections();
    }

    this.setState({ datasets });
  }

  setExpensesAndIncomes() {
    const { chartMonths } = this.state;
    const { collectionsChartData } = this.props;

    const expenses = collectionsChartData.expensesData;
    const incomes = collectionsChartData.incomesData;

    let sortedExpenses = {};
    let sortedIncomes = {};

    chartMonths.forEach(month => {
      sortedExpenses[month] = expenses[month];
      sortedIncomes[month] = incomes[month];
    });

    const datasets = 
    [{
      label: 'Expenses',
      backgroundColor: COLORS.TRANSPARENT,
      borderColor: COLORS.RED,
      borderWidth: 1,
      data: Object.values(sortedExpenses)
    },
    {
      label: 'Incomes',
      backgroundColor: COLORS.TRANSPARENT,
      borderColor: COLORS.GREEN,
      borderWidth: 1,
      data: Object.values(sortedIncomes)
    }];

    return datasets;
  }

  setAllCollections() {
    const { chartMonths } = this.state;
    const { collectionsChartData } = this.props;

    // Sort collectionsChartData by the already sorted months
    Object.keys(collectionsChartData).forEach(collection => {
      let sortedCollectionMonths = {};

      chartMonths.forEach(month => {
        sortedCollectionMonths[month] = collectionsChartData[collection]['values'][month]
      });
      
      collectionsChartData[collection]['values'] = sortedCollectionMonths;
    });

    const datasets = [];

    // Generate datasets for each collection
    Object.keys(collectionsChartData).forEach(collectionTitle => {
      const currentCollectionValues = Object.values(collectionsChartData[collectionTitle]['values']);
      datasets.push({
        label: collectionTitle,
        backgroundColor: COLORS.TRANSPARENT,
        borderColor: collectionsChartData[collectionTitle]['isExpense'] ? COLORS.RED : COLORS.GREEN,
        borderWidth: 1,
        data: currentCollectionValues
      });
    });

    return datasets;
  }

  render() {
    const { chartMonths, datasets } = this.state;

    const collectionsChart = {
      data: {
        labels: chartMonths,
        datasets
      },
      options: {
        hover : { mode: null },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        elements: {
          line: {
            tension: 0
          }
        }
      }
    };

    return (
      <div className="chart-container" id="collections-chart">
        <div className="buttons-group">
          <button onClick={() => this.setState({ renderOnChart: CHART_TYPES.EXPENSES_AND_INCOMES })}>Expenses / Incomes</button>
          <button onClick={() => this.setState({ renderOnChart: CHART_TYPES.ALL_COLLECTIONS })}>All Collections</button>
        </div>

        <Line data={collectionsChart.data} options={collectionsChart.options} />

        <div className="buttons-group">
          <button onClick={() => this.setState({ timePeriod: 12 })}>1 Year</button>
          <button onClick={() => this.setState({ timePeriod: 6 })}>6 Months</button>
          <button onClick={() => this.setState({ timePeriod: 3 })}>3 Months</button>
        </div>
      </div>
    );
  }
}

export default CollectionsChart;