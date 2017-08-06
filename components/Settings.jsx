import React from 'react';
import { Redirect } from 'react-router';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import { formatNotificationReasons } from '../utils/format';

const Settings = ({ loggedIn, match, settings, onNotificationSubscriptionClick }) => {
  const { reasons } = settings.notifications;

  if (!loggedIn && match.url === '/settings') {
    return <Redirect to='/' />;
  }

  const renderCheckBox = (reason) => (
    <Checkbox
      checked={reason.checked}
      onCheck={onNotificationSubscriptionClick.bind(null, reason)}
    />
  );

  return (
    <div className='screen settings-screen'>
      <Paper style={{maxHeight: 200, overflow: 'auto', boxShadow: 'none', borderBottom: '1px solid rgb(224, 224, 224)'}}>
      <List>
        <Subheader>Notification Subscriptions</Subheader>
        {Object.keys(reasons).map(reason => (
          <ListItem
            key={reason}
            leftCheckbox={renderCheckBox(reasons[reason])}
            primaryText={formatNotificationReasons(reason)}
          />
        ))}
      </List>
      </Paper>
    </div>
  );
}

export default Settings;
