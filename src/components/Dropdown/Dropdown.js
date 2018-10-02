import React, { Component } from 'react';

import './Dropdown.css'

class Dropdown extends Component {
  dropItems(e) {
    let element = e.target.nextSibling;

    if (element.clientHeight > 0) {
      element.style.maxHeight = 0;
    } else {
      // Close all other dropdowns
      let allDropdowns = document.getElementsByClassName('dropdown-content');
      
      for (let i = 0; i < allDropdowns.length; i++) {
        allDropdowns[i].style.maxHeight = 0;
      }

      // Give current dropdown it's initial height back.
      element.style.maxHeight = element.scrollHeight + "px";
    }
  }

  render() {
    const { title, items } = this.props;

    return (
      <div className="dropdown-container">
      <a className="opener" onClick={this.dropItems}>{title}</a>
        <div className="dropdown-content">
          {items}
        </div>
      </div>
    );
  }
}

export default Dropdown;