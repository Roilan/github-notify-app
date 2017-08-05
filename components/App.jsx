import React, { Component } from 'react';
import injectTapEvent from 'react-tap-event-plugin';
import ThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Login from './Login';

injectTapEvent();

class App extends Component {
  render() {
    return (
      <ThemeProvider>
        <Login />
      </ThemeProvider>
    );
  }
}

export default App;
