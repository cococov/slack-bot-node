import { getUserInGitlab } from '../../util/util.js'
import { firebase } from '@firebase/app';
import '@firebase/database';

const ERROR_MESSAGE = 'Error agregando usuario :banana:';

export const userAdd = async ({ bot, channel, userId, team, teamName, args: { 'user-add': username } }) => {

    /*
     * get user from Gitlab
     */
    const userGitlab = await getUserInGitlab(username);
    if (!userGitlab) {
        bot.postMessage(channel, `ups! ${username} no existe en gitlab`, null);
        return;
    }

    /*
     * Getting users from team
     */
    const membersUsernames = team.members?.map(it => it.username) ?? [];
    if (membersUsernames.some(u => u === username)) {
        bot.postMessage(channel, `ups! ${username} ya existe en equipo ${teamName}`);
        return;
    }

    // formatting user
    const { id, username: gitlabUsername } = userGitlab;

    // adding new user to team members
    team.members = team.members ?? [] // initialize member if it's necessary
    team.members.push({ id, username: gitlabUsername });


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

    // sending result to bot
    bot.postEphemeral(channel, userId, `Usuario: ${username} añadido con éxito a ${teamName}`, null);
};
