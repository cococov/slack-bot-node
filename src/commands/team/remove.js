import { firebase } from '@firebase/app';
import '@firebase/database';

export const remove = async ({ bot, channel, teamName }) => {
  firebase.database().ref(`teams/${teamName}`).remove();

  const message = `Equipo: [${teamName}] eliminado con exito`
  bot.postMessage(channel, message);
};