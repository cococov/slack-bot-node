import { firebase } from '@firebase/app';
import '@firebase/database';

const ERROR_MESSAGE = "NO pudimos eliminar el equipo :banana:";

export const remove = async ({ bot, channel, userId, teamName }) => {

    const tref = firebase.database().ref(`teams`);
    const snapshot = await tref.once('value');

    // filter teams in order to remove the desired item
    const filteredTeams = snapshot.val().filter(t => t.name !== teamName);

    /**
     * commit changes to DB
     */
    try {
        await tref.set(filteredTeams);
    } catch (e) {
        console.error('An error has occured: ', JSON.stringify(e))
        bot.postEphemeral(channel, userId, ERROR_MESSAGE);
    }

    bot.postMessage(channel, `Equipo: [${teamName}] eliminado con exito :alien:`);
};