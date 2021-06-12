import { firebase } from '@firebase/app';
import '@firebase/database';
import { status, add, create, remove, assign } from './team/index.js';

export const team = async ({ bot, channel, userId, subcommand: teamName, args }) => {
  if (!teamName) {
    bot.postEphemeral(channel, userId, 'Debes ingresar un equipo.');
    return;
  }

  let ref = firebase.database().ref(`teams`);

  ref.on('value', async snapshot => {
    const equip = snapshot.val();
    if (!equip) {
      bot.postEphemeral(channel, userId, `El equipo ${teamName} no existe :sad-parrot: Prueba el comando 'team list' para ver la lista de estos.`);
      return;
    }
    const option = Object.keys(args)[0]
    switch (option) {
      case 'status':
        status({ bot, channel, userId, equip, args });
        break;
      case 'user-add':
        add({ bot, channel, userId, equip, args });
        break;
      case 'remove':
        remove({ bot, channel, teamName });
        break;
      case 'create':
        create({ bot, channel, teamName });
        break;
      case 'help':
        help({ bot, channel, userId });
        break;
      case 'assign':
        assign({ bot, channel, userId, equip, args });
        break;
      default:
        bot.postEphemeral(channel, userId, 'Debes ingresar un comando para equipo.');
    }
  });
};

export default team;
