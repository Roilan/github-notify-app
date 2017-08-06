import React, { Component } from 'react';
import { Redirect } from 'react-router';
import objectAssignDeep from 'object-assign-deep';
import { getNotifications } from '../utils/github';
import Button from './Button';
import Input from './Input';
import ScreenLoader from './ScreenLoader';
import storage from '../utils/storage';

const optionalRequire = require('optional-require')(require);
const devConfig = optionalRequire('../dev.config') || {};

class Login extends Component {
  constructor() {
    super();

    this.state = {
      credentials: {
        username: devConfig.username || '',
        token: devConfig.token || ''
      },
      errorStatus: {
        username: '',
        token: ''
      },
      loading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.validateCredentialFields = this.validateCredentialFields.bind(this);
  }

  onChange(type, e, value) {
    this.setState((prevState) => objectAssignDeep({}, prevState, {
      credentials: {
        [type]: value
      },
      errorStatus: {
        [type]: ''
      }
    }));
  }

  validateCredentialFields() {
    const { credentials } = this.state;
    const emptyFields = Object.keys(credentials).filter(key => credentials[key] === '');
    const isValid = emptyFields.length === 0;
    let status;

    if (!isValid) {
      status = emptyFields.reduce((obj, field) => Object.assign(obj, {
        [field]: `${field} cannot be empty.`
      }), {});
    }

    return {
      isValid,
      status
    };
  }

  async onLogin() {
    const { username, token } = this.state.credentials;
    const validateFields = this.validateCredentialFields();

    if (!validateFields.isValid) {
      this.setState({
        errorStatus: validateFields.status
      });
      return;
    }

    this.setState({ loading: true });

    try {
      const { data, error } = await getNotifications({ username, token });

      if (error) {
        throw new Error(error);
      }

      await storage.set('credentials', { username, token });
      this.props.setNotifications({ notifications: data });
    } catch (error) {
      // TODO: display some error UI
      console.log('ERROR LOGGING IN', error);
    }
  }

  render() {
    const { credentials, errorStatus, loading } = this.state;
    const { loggedIn, match } = this.props;

    if (loggedIn && match.url === '/') {
      return <Redirect to='/settings' />
    }

    const InputFields = Object.keys(this.state.credentials).map(name => (
      <Input
        key={name}
        label={name}
        fullWidth={true}
        errorText={errorStatus[name]}
        onChange={this.onChange.bind(null, name)}
        type={name === 'token' ? 'password' : 'text'}
        value={credentials[name]}
      />
    ));

    return (
      <div className='screen login-screen'>
        {InputFields}

        <div className='login-screen-button-container'>
          <Button
            label='Login'
            disabled={loading}
            primary={true}
            fullWidth={true}
            onClick={this.onLogin}
          />
        </div>

        <ScreenLoader loading={loading} />
      </div>
    );
  }
}

export default Login;
