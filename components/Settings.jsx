import React from 'react';
import { Redirect } from 'react-router';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import Button from './Button';
import Input from './Input';
import { formatNotificationReasons } from '../utils/format';

const Settings = ({
  loggedIn, match, userSettings, onNotificationSubscriptionClick,
  snackbar, onSaveClick, onFrequencyChange, onNotificationsClick,
  timersRunning
}) => {
  const { reasons, frequency, displayFrequency } = userSettings.notifications;

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
      <Paper style={{ maxHeight: 260, overflow: 'auto', boxShadow: 'none', borderBottom: '1px solid rgb(224, 224, 224)' }}>
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

      <Input
        label='Notification Fetch Frequency (minutes)'
        fullWidth={true}
        onChange={onFrequencyChange.bind(null, 'frequency')}
        value={frequency}
      />

      <Input
        label='Notification Display Frequency (minutes)'
        fullWidth={true}
        onChange={onFrequencyChange.bind(null, 'displayFrequency')}
        value={displayFrequency}
      />

      <Button
        disabled={snackbar.open}
        fullWidth={true}
        primary={true}
        label={`${timersRunning ? 'Stop / Clear' : 'Start' } Notification Timers`}
        style={{ marginTop: 'auto', marginBottom: 8 }}
        onClick={onNotificationsClick}
      />

      <Button
        disabled={snackbar.open}
        fullWidth={true}
        primary={true}
        label='Save Settings'
        style={{ marginBottom: 16 }}
        onClick={onSaveClick}
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
