import React, { Component } from 'react';
import { Redirect } from 'react-router';

class Settings extends Component {
  render() {
    const { loggedIn, match } = this.props;

    if (!loggedIn && match.url === '/settings') {
      return <Redirect to='/' />;
    }

    return (
      <div>
        <h1>I'm logged in</h1>
      </div>
    );
  }
}

export default Settings;
