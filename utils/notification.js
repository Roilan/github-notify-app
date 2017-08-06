import { getDoNotDisturb } from 'macos-notification-state';

export const doNotDisturbedDisabled = () => !getDoNotDisturb();

export default ({ title, body }) => {
  if (doNotDisturbedDisabled()) {
    return new Notification(title, { body });
  }
}