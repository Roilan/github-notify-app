import React, { Component } from 'react';
import { createHashHistory } from 'history';
import { Router, Route, Redirect, Switch } from 'react-router';
import injectTapEvent from 'react-tap-event-plugin';
import ThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import Login from './Login';
import Settings from './Settings';
import storage from '../utils/storage';
import { getNotifications } from '../utils/github';
import objectAssignDeep from 'object-assign-deep';

injectTapEvent();

const history = createHashHistory();

class App extends Component {
  constructor() {
    super()

    this.state = {
      currentPath: '/',
      loading: true,
      loggedIn: false,
      notifications: [],
      userSettings: {
        notifications: {
          reasons: {
            assign: {
              name: 'assign',
              checked: false
            },
            author: {
              name: 'author',
              checked: false
            },
            comment: {
              name: 'comment',
              checked: false
            },
            invitation: {
              name: 'invitation',
              checked: false
            },
            manual: {
              name: 'manual',
              checked: false
            },
            mention: {
              name: 'mention',
              checked: false
            },
            'state_change': {
              name: 'state_change',
              checked: false
            },
            subscribed: {
              name: 'subscribed',
              checked: false
            },
            'team_mention': {
              name: 'team_mention',
              checked: false
            }
          },
          frequency: 1 // minutes
        }
      },
      settings: {
        snackbar: {
          open: false,
          message: ''
        }
      },
    };

    this.historyListener;
    this.setNotifications = this.setNotifications.bind(this);
    this.onNotificationSubscriptionClick = this.onNotificationSubscriptionClick.bind(this);
    this.onSaveSettingsClick = this.onSaveSettingsClick.bind(this);
    this.toggleSettingsSnackbar = this.toggleSettingsSnackbar.bind(this);
  }

  async componentDidMount() {
    this.historyListener = history.listen((location) => {
      const { currentPath } = this.state;

      if (currentPath !== location.pathname) {
        this.setState({ currentPath: location.pathname });
      }
    });

    try {
      const credentials = await storage.get('credentials');
      const userSettings = await storage.get('userSettings');
      const hasCredentials = credentials.username && credentials.token;
      const { data } = hasCredentials ? await getNotifications(credentials) : {};

      if (userSettings && Object.keys(userSettings).length) {
        this.setState({ userSettings });
      }

      if (data) {
        this.setNotifications({ notifications: data });
      }
    } catch (error) {
      // TODO: handle this
      console.log('Error signing in with stored credentials or finding data');
    }

    this.setState({ loading: false });
  }

  componentWillUnmount() {
    this.historyListener();
  }

  async setNotifications({ notifications }) {
    this.setState({ notifications, loggedIn: true });
  }

  onNotificationSubscriptionClick({ name, checked }) {
    this.setState(prevState => objectAssignDeep({}, prevState, {
      userSettings: {
        notifications: {
          reasons: {
            [name]: { checked: !checked }
          }
        }
      }
    }));
  }

  toggleSettingsSnackbar({ message, open }) {
    this.setState(prevState => objectAssignDeep({}, prevState, {
      settings: {
        snackbar: {
          open,
          message
        }
      }
    }));
  }

  async onSaveSettingsClick() {
    try {
      await storage.set('userSettings', this.state.userSettings);
      this.toggleSettingsSnackbar({
        message: 'Settings saved successfully!',
        open: true
      });
    } catch (error) {
      // TODO: handle this better, eg: UI prompt
      console.log('Saving settings error', error)
      this.toggleSettingsSnackbar({
        message: 'Error saving settings',
        open: true
      });
    }
  }

  render() {
    const { loading, loggedIn, userSettings } = this.state;

    if (loading) {
      return (
        <ThemeProvider>
          <CircularProgress
            color='white'
            size={80}
            thickness={5}
          />
        </ThemeProvider>
      );
    }

    const renderView = (Component, props = {}) => routeProps => (
      <Component {...props} {...routeProps} />
    );

    const commonProps = { loggedIn };

    const loginProps = Object.assign({}, commonProps, {
      setNotifications: this.setNotifications
    });

    const settingProps = Object.assign({}, commonProps, {
      userSettings,
      onNotificationSubscriptionClick: this.onNotificationSubscriptionClick,
      onSaveSettings: this.onSaveSettingsClick,
      snackbar: Object.assign({}, this.state.settings.snackbar, {
        close: this.toggleSettingsSnackbar.bind(null, { message: '', open: false })
      })
    });

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
