import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { authUser, logout, deleteAccount } from '../../store/actions/auth';
import { removeError } from '../../store/actions/errors';
import withAuth from '../../hocs/withAuth';

import HomePage from '../../components/HomePage/HomePage';
import Dashboard from '../Dashboard/Dashboard';
import Account from '../../components/Account/Account';
import AuthForm from '../../components/Form/Form';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      successMessage: ''
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleLogin(data) {
    this.props.authUser('login', data).then(() => {
      this.setState({ successMessage: 'Successfully logged in!' });
      this.props.history.push('/account');
    });
  }

  handleSignup(data) {
    this.props.authUser('signup', data).then(() => {
      this.setState({ successMessage: 'Successfully signed up!' });
      this.props.history.push('/account');
    });
  }

  render() {
    const { errors, removeError, currentUser, deleteAccount } = this.props;
    
    const AuthDashboard = withAuth(Dashboard);
    const AuthAccount = withAuth(Account);

    return (
      <main>
        <Switch>
          <Route exact path='/' render={props => <HomePage currentUser={currentUser} />} />
          
          <Route exact path='/signup' 
            render={props => 
              <AuthForm 
                formTitle='Sign Up'
                firstLabel='Email'
                secondLabel='Password'
                handleData={this.handleSignup}
                removeError={removeError} 
                errors={errors} 
                {...props} />} />

          <Route exact path='/login' 
            render={props =>
              <AuthForm 
                formTitle='Log In'
                firstLabel='Email'
                secondLabel='Password'
                handleData={this.handleLogin}
                removeError={removeError} 
                errors={errors} 
                {...props} />} />

          <Route exact path='/dashboard'
            render={props => 
              <AuthDashboard {...props} />}/>

          <Route exact path='/account'
            render={props => 
              <AuthAccount currentUser={currentUser} logout={this.props.logout} deleteAccount={deleteAccount} successMessage={this.state.successMessage} {...props} />}/>

        </Switch>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    errors: state.errors
  };
}

export default withRouter(connect(mapStateToProps, { authUser, logout, deleteAccount, removeError })(Main));