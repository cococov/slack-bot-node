import fetch from 'node-fetch';
import { firebase } from '@firebase/app';
import '@firebase/database';

const getBurden = async (equip) => {
  const URL = 'https://gitlab.com/api/v4/projects/3310437/merge_requests?state=opened'
  const apiKey = process.env.GITLAB_API_KEY
  let result = [];

  await Promise.all(equip.map(async (member, index) => {
    let rawResponse = await fetch(
      `${URL}&assignee_id=${member}&not[author_username]=bukhr-tech`,
      { method: 'GET', headers: { 'Authorization': `Bearer ${apiKey}` } }
    );
    let response = await rawResponse.json();
    result[index] = response;
  }));

  return result;
};

export const gitlabBurden = async ({ bot, channel }) => {
  let ref = firebase.database().ref(`baseOptionsId`);
  ref.on('value', async snapshot => {
    const equip = snapshot.val();
    const burden = await getBurden(equip);

    let ref2 = firebase.database().ref(`baseOptions`);
    ref2.on('value', async snapshot => {
      const equipNames = snapshot.val();
      let message = equipNames.reduce((previous, current, index) => {
        return `${previous}\n${current}: ${burden[index].length}`
      }, '');

      bot.postMessage(channel, message);
    });
  });
};