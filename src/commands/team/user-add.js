import { getUserInGitlab, getUsersByTeamInFirebase, getTeamsInFirebase, usernames } from '../../util/util.js'
import { firebase } from '@firebase/app';
import '@firebase/database';

export const userAdd = async ({ bot, channel, userId, teamName, args: { 'user-add':username } }) => {
  const userGitlab = await getUserInGitlab(username);
  if(!(typeof userGitlab === 'object')) {
    return bot.postMessage(channel, `ups! ${username} no existe en gitlab`);
  }

  const usersFirebase = await getUsersByTeamInFirebase(teamName);
  if(usernames(usersFirebase).includes(username)) {
    return bot.postMessage(channel, `ups! ${username} ya existe en equipo ${teamName}`);
  }

  const formattedUser = (({ id, username }) => ({ id, username }))(userGitlab)
  const teams = await getTeamsInFirebase();
  const newTeams = teams.map(team => {
    if(team['name'] === teamName) team['members'].push(formattedUser)
    return team;
  })
  await firebase.database().ref(`teams`).set(
    newTeams, (error) => { if (error) {console.log(error);}
  });
  bot.postEphemeral(channel, userId, `Usuario: ${username} añadido con éxito a ${teamName}`);
};
