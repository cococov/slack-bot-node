import fetch from 'node-fetch';
import { firebase } from '@firebase/app';

const ref = key => firebase.database().ref(key);

export const checkUserExistsInFirebase = async (teamName, username) => {
    return new Promise(async (resolve, _) => {
        const users = await getUsersByTeamInFirebase(teamName);
        const usernames = users["members"].map(user => user["username"])
        console.log(usernames)
        resolve(usernames.includes(username))
    })
}

/**
 * get an user by it's username from gitlab API
 *
 * @example response
     {
        "id": 450214,
        "name": "Andres",
        "username": "agiraldo",
        "state": "active",
        "avatar_url": "https://secure.gravatar.com/avatar/5ced6acfad842719a64f2cd50773fac9?s=80&d=identicon",
        "web_url": "https://gitlab.com/agiraldo"
    }
 * @param username
 * @returns {Promise<*|null>}
 */
export const getUserInGitlab = async (username) => {

    const apiKey = process.env.GITLAB_API_KEY
    const URL = `https://gitlab.com/api/v4/users?username=${username}`

    let rawResponse = null;
    try {
        rawResponse = await fetch(`${URL}`, { method: 'GET', headers: { 'Authorization': `Bearer ${apiKey}` } });
    } catch (e) {
        console.error('An error has occurred', JSON.stringify(e));
    }

    /*
     * Gitlab returns an array
     */
    return rawResponse ? (await rawResponse.json())[0] : null;
}

export const getUsersByTeamInFirebase = async (teamName) => {
    return new Promise((resolve, _) => {
        ref(`teams`).on('value', async snapshot => {
            const result = snapshot.val();
            resolve(result[teamName]["members"])
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
