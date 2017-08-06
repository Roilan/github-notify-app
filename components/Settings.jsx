import React from 'react';
import { Redirect } from 'react-router';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import Button from './Button';
import { formatNotificationReasons } from '../utils/format';

const Settings = ({
  loggedIn, match, userSettings, onNotificationSubscriptionClick,
  snackbar, onSaveSettings
}) => {
  const { reasons } = userSettings.notifications;
  console.log('snackbar', snackbar)

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
      <Paper style={{ maxHeight: 200, overflow: 'auto', boxShadow: 'none', borderBottom: '1px solid rgb(224, 224, 224)' }}>
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

      <Button
        disabled={snackbar.open}
        fullWidth={true}
        primary={true}
        label='Save'
        style={{ marginTop: 'auto', marginBottom: 24 }}
        onClick={onSaveSettings}
      />

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onRequestClose={snackbar.close}
      />
    </div>
  );
}

export default Settings;
