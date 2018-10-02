import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <footer>
        <p>Made with <a href='https://www.chartjs.org/'>chart.js</a></p>
        <p>Copyright © 2018 | Website by Cristi Cismas</p>
        <p><a href='https://cristicismas.github.io'>My Portfolio</a></p>
      </footer>
    );
  }
}

export default Footer;