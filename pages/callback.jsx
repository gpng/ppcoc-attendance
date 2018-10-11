import { Component } from 'react';
import Router from 'next/router';

// components
import auth0Client from '../components/Auth';

class Callback extends Component {
  async componentDidMount() {
    await auth0Client.handleAuthentication();
    const routeTo = localStorage.getItem('route');
    Router.push(routeTo || '/');
  }

  render() {
    return null;
  }
}

export default Callback;
