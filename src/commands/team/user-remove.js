import { getUsersByTeamInFirebase, getUserInGitlab, usernames } from '../../util/util.js'
import { firebase } from '@firebase/app';
import '@firebase/database';

export const userRemove = async ({ bot, channel, userId, teamName, args: { 'user-rm':username } }) => {
  const usersFirebase = await getUsersByTeamInFirebase(teamName);
  if(!usernames(usersFirebase).includes(username)) { return bot.postMessage(channel, `ups! ${username} no existe en equipo ${teamName}`);}

  const userGitlab = await getUserInGitlab(username);
  const formattedUser = (({ id, username }) => ({ id, username }))(userGitlab)
  const newUsers = usersFirebase.filter(user => Object.values(user)[1] != Object.values(formattedUser)[1])
  await firebase.database().ref(`teams/${teamName}`).child('members').set(
    newUsers, (error) => { if (error) {console.log(error);}
  });

  bot.postEphemeral(channel, userId, `Usuario: ${username} removido con éxito de ${teamName}`);
};