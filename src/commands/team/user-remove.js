import { getUsersByTeamInFirebase, getTeamsInFirebase, usernames } from '../../util/util.js';
import { firebase } from '@firebase/app';
import '@firebase/database';

export const userRemove = async ({ bot, channel, userId, teamName, args: { 'user-rm': username } }) => {
  const usersFirebase = await getUsersByTeamInFirebase(teamName);
  if (!usernames(usersFirebase).includes(username)) { return bot.postMessage(channel, `ups! ${username} no existe en equipo ${teamName}`); }

  const newUsers = usersFirebase.filter(user => user.username !== username)

  const teams = await getTeamsInFirebase();

  const newTeams = teams.map(team => {
    if (team['name'] === teamName) team['members'] = newUsers
    return team;
  })

  await firebase.database().ref(`teams`).set(
    newTeams, (error) => {
      if (error) { console.log(error); }
    });

  bot.postEphemeral(channel, userId, `Usuario: ${username} removido con éxito de ${teamName}`);
};
