import React, { Component } from 'react';
import { createHashHistory } from 'history';
import { Router, Route, Redirect, Switch } from 'react-router';
import injectTapEvent from 'react-tap-event-plugin';
import ThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Login from './Login';
import Settings from './Settings';

injectTapEvent();

const history = createHashHistory();

class App extends Component {
  constructor() {
    super()

    this.state = {
      loggedIn: false,
      notifications: []
    };

    this.setLogin = this.setLogin.bind(this);
    this.setNotifications = this.setNotifications.bind(this);
  }

  setNotifications({ notifications }) {
    this.setState({ notifications, loggedIn: true });
  }

  setLogin() {
    this.setState({ loggedIn: true });
  }

  render() {
    const { loggedIn } = this.state;

    const renderView = (Component, props = {}) => routeProps => (
      <Component {...props} {...routeProps} />
    );

    const commonProps = { loggedIn };

    const loginProps = Object.assign({}, commonProps, {
      setNotifications: this.setNotifications
    });

    const settingProps = Object.assign({}, commonProps);

    return (
      <ThemeProvider>
        <Router history={history}>
          <Switch>
            <Route exact={true} path='/' render={renderView(Login, loginProps)} />
            <Route exact={true} path='/settings' render={renderView(Settings, settingProps)} />
          </Switch>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
