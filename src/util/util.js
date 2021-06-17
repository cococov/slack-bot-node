import fetch from 'node-fetch';
import { firebase } from '@firebase/app';

const ref = key => firebase.database().ref(key);

export const checkUserExistsInFirebase = async (teamName, username) => {
  return new Promise(async (resolve, _) => {
    const users = await getUsersByTeamInFirebase(teamName);
    const usernames = users["members"].map(user => user["username"])
    resolve(usernames.includes(username))
  })
}

export const getUserInGitlab = async (username) => {
  return new Promise(async (resolve, _) => {
    const apiKey = process.env.GITLAB_API_KEY
    const URL = `https://gitlab.com/api/v4/users?username=${username}`
    const rawResponse = await fetch(`${URL}`, { method: 'GET', headers: { 'Authorization': `Bearer ${apiKey}` } });
    const response = await rawResponse.json();
    resolve(response[0]);
  })
}

export const getTeamsInFirebase = async (_) => {
  return new Promise((resolve, _) => {
    ref(`teams`).on('value', async snapshot => {
      const result = snapshot.val();
      resolve(result);
    })
  });
}

export const getUsersByTeamInFirebase = async (teamName) => {
  return new Promise((resolve, _) => {
    ref(`teams`).on('value', async snapshot => {
      const result = snapshot.val();
      const resultFilteredByTeam = result.filter(obj => obj['name'] === teamName)[0]
      resolve(resultFilteredByTeam["members"])
    })
  });
}

/**
 * Check if user is in gitlab
 * @param username username to check
 * @returns {Promise<boolean>} True if user exists, otherwise False
 */
export const checkGitlabUser = async (username) => {
  return await getUserInGitlab(username) !== null;
}

export const jsonResponseFormatter = text => `\`\`\`${text}\`\`\``;
export const usernames = usersFirebase => usersFirebase.map(user => user.username)
