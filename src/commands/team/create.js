import { firebase } from '@firebase/app';
import '@firebase/database';

const ERROR_MESSAGE = 'No se ha podido agregar el equipo :broken_hearth:';

/**
 * Create a new team
 * @param bot bot
 * @param channel slack channel
 * @param userId slack user
 * @param teamName team name
 * @returns {Promise<void>}
 */
export const create = async ({ bot, channel, userId, teamName }) => {

    const tref = firebase.database().ref('teams')

    let teams = [];
    try {
        const snapshot = await tref.once('value');
        teams = snapshot.val();
    } catch (e) {
        console.error('An error has occurred: ', JSON.stringify(e));
        bot.postEphemeral(channel, userId, ERROR_MESSAGE, null);
        return;
    }

    // Check if team exists
    const teamExists = teams.some(t => t.name === teamName)
    if (teamExists) {
        bot.postEphemeral(channel, userId, `Equipo: ${teamName} ya existe!. :banana:`, null);
        return;
    }

    //adding new team to collection array
    teams.push({ name: teamName, heroes: [], members: [] });
    /**
     * pushing item to DB
     */
    try {
        await tref.set(teams);
    } catch (e) {
        bot.postMessage(channel, userId, ERROR_MESSAGE, null);
        return;
    }

    bot.postMessage(channel, `Equipo: ${teamName} creado con exito`);
}
