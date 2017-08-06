import GithubApi from 'github-api';

// TODO: figure out a smarter way to do this

export const getNotifications = async ({ username, token }) => {
  const user = new GithubApi({ username, token }).getUser();

  try {
    const notifications = (await user.listNotifications()).data;

    return { data: notifications };
  } catch (error) {
    return { error };
  }
}

export default ({ username, token }) => {
  return new GithubApi({ username, token });
}
