import fetch from 'node-fetch';

const getBurden = async (equip) => {
  const URL = 'https://gitlab.com/api/v4/projects/3310437/merge_requests?state=opened'
  const apiKey = process.env.GITLAB_API_KEY
  let result = [];

  await Promise.all(equip.map(async (member, index) => {
    let rawResponse = await fetch(
      `${URL}&assignee_id=${member['id']}&not[author_username]=bukhr-tech`,
      { method: 'GET', headers: { 'Authorization': `Bearer ${apiKey}` } }
    );
    result[index] = await rawResponse.json();
  }));

  return result;
};

export const status = async ({ bot, channel, userId, equip }) => {
  const burden = await getBurden(equip['members']);
  const burdens = equip['members'].reduce((previous, current, index) => {
    return `${previous}\n${current['username']}: ${burden[index].length}`
  }, '');

  const message = `${burdens}\nHeros: [${equip['heroes'].join(', ')}]`
  bot.postEphemeral(channel, userId, message);
};