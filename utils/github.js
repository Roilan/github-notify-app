import GithubApi from 'github-api';

// TODO: figure out a smarter way to do this

export const getNotifications = ({ username, token }) => {
  const user = new GithubApi({ username, token }).getUser();

  return user.listNotifications();
}

export default ({ username, token }) => {
  return new GithubApi({ username, token });
}
