import { firebase } from '@firebase/app';
import '@firebase/database';

const ERROR_MESSAGE = 'Error obteniendo lista de proyectos :banana:';

/**
 * send projects list to bot
 * @param bot slack bot
 * @param channel slack channel
 * @param userId slack user
 * @returns {Promise<void>}
 */
export const list = async ({ bot, channel, userId }) => {

    let projects = [];

    /*
     * fetch projects from DB
     */
    try {
        const pref = firebase.database().ref(`projects`)
        const snapshot = await pref.once('value');
        projects = snapshot.val();
    } catch (e) {
        console.error('An error has occurred', JSON.stringify(e));
        bot.postEphemeral(channel, userId, ERROR_MESSAGE);
        return;
    }

    /*
     * building response
     */
    let message = `Lista de Proyectos (nompre:id):\n`;
    message += projects.reduce((strBuilder, current, index) => {
        return strBuilder + `\n${current['name']}: ${current['id']}`
    }, '');

    bot.postEphemeral(channel, userId, message, null);
};