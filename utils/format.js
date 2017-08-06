import capitalize from 'capitalize';
import userReasons from '../utils/user-reasons';

export const formatNotificationReasons = (text) => {
  const split = text.split('_');
  const hasUnderscore = split.length > 1;
  let formattedText;

  if (hasUnderscore) {
    formattedText = split.map(splitText => capitalize(splitText)).join(' ');
  } else {
    formattedText = capitalize(text);
  }

  return formattedText;
}

export const formatNotificationData = ({ notifications, userSettings }) => {
  const { reasons } = userSettings.notifications;
  const usersAcceptedReasons = userReasons(reasons).array;

  return notifications.filter((notification) => {
    const isValidReason = usersAcceptedReasons.find(reason => reason === notification.reason);

    return isValidReason;
  });
};
