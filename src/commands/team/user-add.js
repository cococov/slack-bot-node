import { getUserInGitlab, getUsersByTeamInFirebase, usernames } from '../../util/util.js'
import { firebase } from '@firebase/app';
import '@firebase/database';

export const userAdd = async ({ bot, channel, userId, team, teamName, args: { 'user-add':username } }) => {
  const userGitlab = await getUserInGitlab(username);
  if(!(typeof userGitlab === 'object')) {
    return bot.postMessage(channel, `ups! ${username} no existe en gitlab`);
  }

  const usersFirebase = (await getUsersByTeamInFirebase(teamName)) || [];
  if(usernames(usersFirebase).includes(username)) {
    return bot.postMessage(channel, `ups! ${username} ya existe en equipo ${teamName}`);
  }

  const formattedUser = (({ id, username }) => ({ id, username }))(userGitlab)
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
