import fetch from 'node-fetch';
import { any } from 'rambda';

const random = (min, max) => Math.floor((Math.random() * (max - min + 1)) + min);

const putAssign = async (mr, user) => {
  const URL = `https://gitlab.com/api/v4/projects/3310437/merge_requests/${mr}`
  const apiKey = process.env.GITLAB_API_KEY

  await fetch(URL, {
    method: 'PUT',
    body: JSON.stringify({ assignee_id: user }),
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    'Content-Type': 'application/json'
  });
};

const getBurden = async (equip) => {
  const URL = 'https://gitlab.com/api/v4/projects/3310437/merge_requests?state=opened'
  const apiKey = process.env.GITLAB_API_KEY
  let result = [];

  await Promise.all(equip.map(async (member, index) => {
    let rawResponse = await fetch(
      `${URL}&assignee_id=${member['id']}&not[author_username]=bukhr-tech`,
      { method: 'GET', headers: { 'Authorization': `Bearer ${apiKey}` } }
    );
    let response = await rawResponse.json();
    result[index] = response.length;
  }));

  return result;
};

const getChosen = (burden, equip) => {
  let minCant = 999;
  const all = burden.reduce((previous, current, index) => {
    if (any(a => a === equip['members'][index]['username'], equip['heroes']) || current > minCant)
      return previous;
    let others = (minCant != current) ? [] : previous;
    minCant = current;
    return [...others, equip['members'][index]['id']]
  }, []);

  return all[random(0, (all.length - 1))]
};

/**
 * @bot team rmcl assign 456
 */
export const assign = async ({ bot, channel, team, args: { assign } }) => {
  const burden = await getBurden(team['members']);
  const chosen = getChosen(burden, team);

  await putAssign(assign, chosen);

  bot.postMessage(channel, `MR asignado con éxito.`);
};