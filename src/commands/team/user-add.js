import { getUserInGitlab, getUsersByTeamInFirebase, usernames } from '../../util/util.js'
import { firebase } from '@firebase/app';
import '@firebase/database';
import { split } from 'rambda';

const formatEmail = (str) => split('<mailto:', split('|', str)[0])[1];

export const userAdd = async ({ bot, channel, userId, team, teamName, args: { 'user-add': username, email, 'gitlab-id': gitlabId } }) => {
  if (!username || !email) {
    bot.postEphemeral(channel, userId, `Debe ingresar un usuario y email como mínimo.`);
    return;
  }

  let id = gitlabId;
  if (!gitlabId) {
    const userGitlab = await getUserInGitlab(username);
    if (!(typeof userGitlab === 'object')) {
      bot.postMessage(channel, `ups! ${username} no existe en gitlab`);
      return;
    } else {
      id = userGitlab['id'];
    }
  }

  const usersFirebase = (await getUsersByTeamInFirebase(teamName)) || [];
  if (usernames(usersFirebase).includes(username)) {
    bot.postMessage(channel, `ups! ${username} ya existe en equipo ${teamName}`);
    return;
  }

  const formattedUser = { id, username, email: formatEmail(email) }
  usersFirebase.push(formattedUser)

  const tref = firebase.database().ref('teams')
  let teams = [];
  try {
    teams = (await tref.once('value')).val();
  } catch (e) {
    console.error('An error has occurred: ', JSON.stringify(e));
    bot.postEphemeral(channel, userId, ERROR_MESSAGE, null);
    return;
  }
  const index = teams.findIndex(t => t.name === teamName);
  team.members = usersFirebase;
  teams[index] = team;

  await tref.set(teams);

  bot.postEphemeral(channel, userId, `Usuario: ${username} añadido con éxito a ${teamName}`);
};
