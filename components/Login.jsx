import React, { Component } from 'react';
import Input from './Input';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      token: ''
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(type, e, value) {
    this.setState({
      [type]: value
    });
  }

  render() {
    const InputFields = Object.keys(this.state).map(name => (
      <Input
        key={name}
        label={name}
        onChange={this.onChange.bind(null, name)}
        value={this.state[name]}
      />
    ));

    return (
      <div className='login-screen'>
        {InputFields}
      </div>
    );
  }
}

export default Login;
