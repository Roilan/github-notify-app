import capitalize from 'capitalize';

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