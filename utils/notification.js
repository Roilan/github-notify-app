import { getDoNotDisturb } from 'macos-notification-state';

export default ({ title, body }) => {
  const doNotDisturbedEnabled = getDoNotDisturb();

  if (!doNotDisturbedEnabled) {
    return new Notification(title, { body });
  }
}