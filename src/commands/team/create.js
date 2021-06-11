import { firebase } from '@firebase/app';
import '@firebase/database';

export const create = async ({ bot, channel, teamName }) => {

  firebase.database().ref(`teams/${teamName}`).set({
    teamName,
    heroes: [],
    members: []
  }, (error) => {
    if (error) {
      console.log(error);
    }
  });

  const message = `Equipo: ${teamName} creado con exito`
  bot.postMessage(channel, message);
};