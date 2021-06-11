import { firebase } from '@firebase/app';
import '@firebase/database';
import { status } from './team/index.js';

export const team = async ({ bot, channel, userId, params: [teamName, subCommand, ...args] }) => {
  console.log('team')
  if (!teamName) {
    bot.postMessage(channel, 'Debes ingresar un equipo.');
    return;
  }

  let ref = firebase.database().ref(`teams`).child(teamName);
  ref.on('value', async snapshot => {
    const equip = snapshot.val();
    if (!equip) {
      bot.postMessage(channel, `El equipo ${teamName} no existe :sad-parrot: Prueba el comando 'team list' para ver la lista de estos.`);
      return;
    }

    switch (subCommand) {
      case 'status':
        status({ bot, channel, userId, equip, args });
        break;
      default:
        bot.postMessage(channel, 'Debes ingresar un comando para equipo.');
    }
  });
};

export default team;