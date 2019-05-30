import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Header.css'

class Header extends Component {
  render() {
    if (this.props.currentUser.isAuthenticated)
      return (
        <header>
          <div className='buttons-group hide'>
            <div>Dashboard</div>
            <div>Account</div>
          </div>
          <Link to='/exanin'><h1>Exanin</h1></Link>
          <div className='buttons-group'>
            <Link to='/exanin/dashboard'>Dashboard</Link>
            <Link to='/exanin/account'>Account</Link>
          </div>
        </header>
      );
    else
      return (
        <header>
          <div className='buttons-group hide'>
            <div>Sign Up</div>
            <div>Login</div>
          </div>
          <Link to='/exanin'><h1>Exanin</h1></Link>
          <div className='buttons-group'>
            <Link to='/exanin/signup'>Sign Up</Link>
            <Link to='/exanin/login'>Login</Link>
          </div>
        </header>
      );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

export default connect(mapStateToProps, null)(Header);
