import React, { Component } from 'react';
import { createHashHistory } from 'history';
import { Router, Route, Redirect, Switch } from 'react-router';
import injectTapEvent from 'react-tap-event-plugin';
import ThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import objectAssignDeep from 'object-assign-deep';
import toMs from 'to-ms';
import arrayDiff from 'simple-array-diff';
import Login from './Login';
import Settings from './Settings';
import storage from '../utils/storage';
import { getNotifications } from '../utils/github';
import { formatNotificationData } from '../utils/format';
import userReasons from '../utils/user-reasons';
import sendNotification from '../utils/notification';

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
      notificationsBatch: [],
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
          frequency: 10,
          displayFrequency: 1
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
    this.notificationTimer;
    this.clearNotificationTimer = this.clearNotificationTimer.bind(this);
    this.setNotifications = this.setNotifications.bind(this);
    this.onNotificationSubscriptionClick = this.onNotificationSubscriptionClick.bind(this);
    this.onSaveSettingsClick = this.onSaveSettingsClick.bind(this);
    this.onFrequencyChange = this.onFrequencyChange.bind(this);
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
        this.setState(prevState => objectAssignDeep({}, prevState, { userSettings }));
      }

      if (data) {
        this.setNotifications({ notifications: data });
      }
    } catch (error) {
      // TODO: handle this
      console.log('Error signing in with stored credentials or finding data');
    }

    this.setNotificationTimer();
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    this.historyListener();
    this.clearNotificationTimer();
  }

  clearNotificationTimer() {
    if (this.notificationTimer) {
      clearInterval(this.notificationTimer);
    }
  }

  setNotificationTimer() {
    const { loggedIn, userSettings, notifications } = this.state;
    const { reasons, frequency, displayFrequency } = userSettings.notifications;

    if (loggedIn && userReasons(reasons).length && frequency & displayFrequency && frequency > displayFrequency) {
      this.notificationTimer = setInterval(async () => {
        // TODO: Refactor `Login` and move credentials into this App component
        // Fetching from local FS is expensive and dirty
        try {
          const credentials = await storage.get('credentials');
          const hasCredentials = credentials.username && credentials.token;
          const { data } = hasCredentials ? await getNotifications(credentials) : {};

          if (!data) {
            throw new Error('Unable to get notifications');
          }

          const formattedNewNotifications = formatNotificationData({ notifications: data, userSettings });
          const newNotifications = arrayDiff(notifications, formattedNewNotifications, 'id').common;
          // TODO: should be `added`, only `common` for testing

          if (newNotifications) {
            this.setState(prevState => ({
              notifications: prevState.notifications.concat(newNotifications),
              notificationsBatch: prevState.notificationsBatch.concat(newNotifications)
            }));
          }
        } catch (error) {
          // TODO: handle error better
          sendNotification({ title: 'Notification Timer Error', body: error });
          this.clearNotificationTimer();
        }
      }, toMs.minutes(frequency))
    }
  }

  async setNotifications({ notifications }) {
    const { userSettings } = this.state;

    this.setState({
      notifications: formatNotificationData({ notifications, userSettings }),
      loggedIn: true
    });
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

  onFrequencyChange(type, e, value) {
    const isValidValue = !isNaN(value);

    if (isValidValue) {
      this.setState(prevState => objectAssignDeep({}, prevState, {
        userSettings: {
          notifications: {
            [type]: value
          }
        }
      }));
    }
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
    const { userSettings } = this.state;
    const { notifications } = userSettings;

    if (notifications.frequency === 0 || notifications.displayFrequency === 0) {
      this.toggleSettingsSnackbar({
        message: 'Error: Frequency cannot be 0',
        open: true
      })
      return;
    }

    if (notifications.frequency <= notifications.displayFrequency) {
      this.toggleSettingsSnackbar({
        message: 'Error: Fetch must be higher than display',
        open: true
      })
      return;
    }

    try {
      await storage.set('userSettings', userSettings);
      this.toggleSettingsSnackbar({
        message: 'Settings saved successfully!',
        open: true
      });
    } catch (error) {
      // TODO: handle this better, eg: UI prompt
      console.log('Saving settings error', error)
      this.toggleSettingsSnackbar({
        message: 'Error: Unable to save settings',
        open: true
      });
    }
  }

  render() {
    const { loading, loggedIn, userSettings } = this.state;

    console.log('STATE', this.state);

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
      }),
      onFrequencyChange: this.onFrequencyChange
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
