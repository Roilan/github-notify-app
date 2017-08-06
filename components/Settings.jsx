import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import { formatNotificationReasons } from '../utils/format';

class Settings extends Component {
  constructor() {
    super();

    this.state = {
      notifications: {
        reasons: [
          'assign', 'author', 'comment', 'invitation', 'manual',
          'mention', 'state_change', 'subscribed', 'team_mention'
        ],
        frequency: 1 // minutes
      }
    };
  }

  render() {
    const { reasons } = this.state.notifications;
    const { loggedIn, match } = this.props;

    if (!loggedIn && match.url === '/settings') {
      return <Redirect to='/' />;
    }

    return (
      <div className='screen settings-screen'>
        <Paper style={{maxHeight: 200, overflow: 'auto', boxShadow: 'none', borderBottom: '1px solid rgb(224, 224, 224)'}}>
        <List>
          <Subheader>Notification Subscriptions</Subheader>
          {reasons.map(reason => (
            <ListItem
              key={reason}
              leftCheckbox={<Checkbox />}
              primaryText={formatNotificationReasons(reason)}
            />
          ))}
        </List>
        </Paper>
      </div>
    );
  }
}

export default Settings;
