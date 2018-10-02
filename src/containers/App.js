import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../store';
import { setAuthorizationToken, setCurrentUser } from '../store/actions/auth';
import jwtDecode from 'jwt-decode';

import Header from './Header/Header';
import Main from './Main/Main';
import Footer from '../components/Footer/Footer';

const store = configureStore();

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  try {
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
  } catch (e) {
    store.dispatch(setCurrentUser({}));
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
          <div className='App'>
            <Header />
            <Main />
            <Footer />
          </div>
      </Provider>
    );
  }
}

export default App;
