import React, { Component } from 'react';
import Button from './Button';
import Input from './Input';
import ScreenLoader from './ScreenLoader';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      token: '',
      loading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  onChange(type, e, value) {
    this.setState({
      [type]: value
    });
  }

  onLogin() {
    this.setState({ loading: true });
  }

  render() {
    const { loading } = this.state;

    const InputFields = Object.keys(this.state).filter(name => name !== 'loading').map(name => (
      <Input
        key={name}
        label={name}
        fullWidth={true}
        onChange={this.onChange.bind(null, name)}
        value={this.state[name]}
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
