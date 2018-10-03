import React, { Component } from 'react';
import './Account.css';

import Overlay from '../Overlay/Overlay';
import Success from '../Success/Success';

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteAccountConfirmation: false
    };

    this.logout = this.logout.bind(this);
    this.handleRemoveAccount = this.handleRemoveAccount.bind(this);
  }

  logout() {
    this.props.logout();
    this.props.history.push('/exanin/')
  }

  handleRemoveAccount(userId) {
    this.props.deleteAccount(userId)
      .then(() => this.logout());
  }

  render() {
    const { showDeleteAccountConfirmation } = this.state;

    const DeleteAccountConfirmation = props => (
      <div className='confirmation'>
        <h3 className='confirmation-title'>Are you sure you want to delete this account? <br /><br /> This is a permanent action and you will lose all data associated with the account.</h3>
        <div className='confirmation-btn-group'>
          <button 
            className='confirmation-btn confirmation-btn-danger' 
            onClick={() => {
              this.handleRemoveAccount(props.currentUser.user.id);
              props.closeOverlay();
            }
          }>Confirm</button>
        </div>
      </div>
    );

    return (
      <div id='account'>

        <Success message={this.props.successMessage} />

        <div className='account-header'>
          <h1>My Account</h1>
          <a id='logout' onClick={this.logout}>Log out</a>
        </div>

        <hr />

        <div className='account-settings'>
          <button id='delete-account' onClick={() => this.setState({ showDeleteAccountConfirmation: true })}>Delete Account</button>
        </div>

        {
          showDeleteAccountConfirmation ?
          ( 
            <Overlay 
              content={<DeleteAccountConfirmation closeOverlay={() => this.setState({ showDeleteConfirmation: false })} {...this.props} />}
              closeOverlay={() => this.setState({ showDeleteAccountConfirmation: false })}
              maxWidth='45%' /> 
          ) :
          null
        }
      </div>
    );
  }
}

export default Account;