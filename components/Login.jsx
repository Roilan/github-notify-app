import React, { Component } from 'react';
import objectAssignDeep from 'object-assign-deep';
import { username, token } from '../dev.config';
import { getNotifications } from '../utils/github';
import Button from './Button';
import Input from './Input';
import ScreenLoader from './ScreenLoader';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      credentials: {
        username: username,
        token: token
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

    let notifications = await getNotifications({ username, token });
    console.log(notifications);
    // this.setState({ loading: true });
  }

  render() {
    const { credentials, errorStatus, loading } = this.state;

    const InputFields = Object.keys(this.state.credentials).map(name => (
      <Input
        key={name}
        label={name}
        fullWidth={true}
        errorText={errorStatus[name]}
        onChange={this.onChange.bind(null, name)}
        value={credentials[name]}
      />
    ));

    return (
      <div className='login-screen'>
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
