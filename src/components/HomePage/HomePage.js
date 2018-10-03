import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import './HomePage.css';

class HomePage extends Component {
  render() {
    const isAuthenticated = this.props.currentUser.isAuthenticated;

    const heroChart = {
      data: {
        labels: ['Rent', 'Shopping', 'Food', 'School'],
        datasets: [
          {
            label: 'Balance',
            backgroundColor: ['#22559C', '#F27370', '#FA9856', '#EDE862'],
            data: [250, 250, 250, 250]
          }
        ]
      },
      options: {
        legend: { display: false }
      }
    };

    const firstBodyChart = {
      data: {
        labels: ['Food', 'Rent', 'Shopping'],
        datasets: [
          {
            label: 'Money Spent',
            backgroundColor: ['#00ADB5', '#FF5D5D', '#952E4B'],
            data: [200, 400, 300]
          }
        ]
      },
      options: {
        legend: { display: false },
        animation: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    };

    const secondBodyChart = {
      data: {
        labels: ['Vegetables', 'Fruits', 'Restaurants'],
        datasets: [
          {
            backgroundColor: ['#FC5748', '#FC9349', '#FFC13D'],
            data: [150, 100, 350]
          }
        ]
      },
      options: {
        legend: { display: false },
        animation: false,
        title: {
          display: true,
          text: 'Food'
        }
      }
    };

    return (
      <div id='home'>
        <h3>Manage your expenses with ease.</h3>
        <div id="hero-chart" className="chart-container">
          <Doughnut 
            data={heroChart.data}
            responsive={true}
            options={heroChart.options} />
        </div>

        <section>
          <div className='content'>
            <p>Managing your expenses can often prove difficult, as you have to keep track of so many things at the same time.<br /><br /><b>Exanin</b> makes it a lot easier.</p>
            <div className='chart-container'>
              <Bar 
                data={firstBodyChart.data}
                responsive={true}
                options={firstBodyChart.options} />
            </div>
          </div>
        </section>

        <section>
          <div className='content'>
            <div className='chart-container'>
              <Pie
                data={secondBodyChart.data}
                responsive={true}
                options={secondBodyChart.options} />
            </div>
            <p>Visualising your transactions is now easier than ever before! Exanin will help you manage everything with ease.</p>
          </div>
        </section>

        <section>
          {
            isAuthenticated ? 
            (<Link to='/exanin/dashboard' id='cta'>Dashboard</Link>):
            (<Link to='/exanin/signup' id='cta'>Sign Up</Link>)
          }
        </section>
      </div>
    );
  }
}

export default HomePage;