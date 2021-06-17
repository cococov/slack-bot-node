import fetch from 'node-fetch';
import { any, find } from 'rambda';

const random = (min, max) => Math.floor((Math.random() * (max - min + 1)) + min);

const putAssign = async (mr, user) => {
  const URL = `https://gitlab.com/api/v4/projects/3310437/merge_requests/${mr}`
  const apiKey = process.env.GITLAB_API_KEY

  const response = await fetch(URL, {
    method: 'PUT',
    body: JSON.stringify({ assignee_id: user }),
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
  });

  return response.status === 200
};

const getBurden = async (equip) => {
  const URL = 'https://gitlab.com/api/v4/projects/3310437/merge_requests?state=opened'
  const apiKey = process.env.GITLAB_API_KEY
  const result = [];

  await Promise.all(equip.map(async (member, index) => {
    const rawResponse = await fetch(
      `${URL}&reviewer_id=${member['id']}&not[author_username]=bukhr-tech`,
      { method: 'GET', headers: { 'Authorization': `Bearer ${apiKey}` } }
    );
    const response = await rawResponse.json();
    result[index] = response.length;
  }));

  return result;
};

const getChosen = (burden, equip) => {
  let minCant = Infinity;
  const all = burden.reduce((previous, current, index) => {
    if (current === undefined || isHero(equip, index) || current > minCant)
      return previous;
    const others = (minCant != current) ? [] : previous;
    minCant = current;
    return [...others, equip['members'][index]['id']]
  }, []);

  return all[random(0, (all.length - 1))]
};

const isHero = (equip, index) => any(hero => hero === equip['members'][index]['username'], equip['heroes']);

const findChosenMemberEmailByGitLabId = (chosen, team) => find((member) => member['id'] === chosen, team['members'])['email'];
const findChosenMemberSlackUserByEmail = (chosenMemberEmail, members) => find((member) => member['profile']['email'] === chosenMemberEmail, members);

/**
 * @bot team rmcl assign 456
 */
export const assign = async ({ bot, userId, channel, team, args: { assign } }) => {
  const members = bot.getUsers()['_value']['members'];
  const burden = await getBurden(team['members']);
  const chosen = getChosen(burden, team);
  const chosenMemberEmail = findChosenMemberEmailByGitLabId(chosen, team);
  const chosenMemberSlackUser = findChosenMemberSlackUserByEmail(chosenMemberEmail, members);

  const success = await putAssign(assign, chosen);

  const message = success ? 'MR asignado con éxito.' : 'Hubo problemas al asignar el MR, contacte con un administrador. :sad-parrot:';
  bot.postEphemeral(channel, userId, message, null);

  if (!!chosenMemberEmail && !!chosenMemberSlackUser) {
    bot.openIm(chosenMemberSlackUser['id']);
    const chatId = find((chat) => chat['user'] === chosenMemberSlackUser['id'], bot.ims)['id'];
    const mrLink = `https://gitlab.com/bukhr/buk-webapp/-/merge_requests/${assign}`;
    bot.postMessage(chatId, `<@${chosenMemberSlackUser['id']}> se te asignó este <${mrLink}|MR>. :gift:`)
    bot.postMessage(channel, `El <${mrLink}|MR> fue asignado a <@${chosenMemberSlackUser['id']}>.`);
  } else {
    bot.postEphemeral(channel, userId, 'No se encontró el usuario de slack para notificar.', null);
  }
};