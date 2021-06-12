import { firebase } from '@firebase/app';
import '@firebase/database';

const ERROR_MESSAGE = 'Error agregando usuario :banana:';

export const userRemove = async ({ bot, channel, userId, team, teamName, args: { 'user-rm': username } }) => {

    /*
       * Getting users from team
       */
    const membersUsernames = team.members?.map(it => it.username) ?? [];
    if (!membersUsernames.some(u => u === username)) {
        bot.postMessage(channel, `ups! ${username} no existe en equipo ${teamName}`);
        return;
    }

    // excluding desired username from team members
    team.members = team.members ?? [] // initialize member if it's necessary
    team.members = team.members.filter(it => it.username !== username);


    /*
     * fetch all teams from DB and replace
     * @type {Reference}
     */
    const tref = firebase.database().ref('teams');
    const snapshot = await tref.once('value');
    const allTeams = snapshot.val()

    // replace team
    const index = allTeams.findIndex(t => t.name === teamName);
    allTeams[index] = team;

    // store changes in DB
    try {
        await tref.set(allTeams)
    } catch (e) {
        console.error('An error has occurred: ', JSON.stringify(e))
        bot.postEphemeral(channel, userId, ERROR_MESSAGE, null);
        return;
    }

    bot.postEphemeral(channel, userId, `Usuario: ${username} removido con éxito de ${teamName}`);
};
