import { firebase } from '@firebase/app';
import '@firebase/database';
import { status, userAdd, create, remove, assign } from './team/index.js';

export const team = async ({ bot, channel, userId, subcommand: teamName, args }) => {
  if (!teamName) {
    bot.postEphemeral(channel, userId, 'upos! Debes ingresar un equipo.');
    return;
  }

  let ref = firebase.database().ref(`teams`);

  ref.on('value', async snapshot => {
    const teams = snapshot.val();
    const team = teams[teamName];
    if (!team) {
      bot.postEphemeral(channel, userId, `ups! El equipo ${teamName} no existe :sad-parrot: Prueba el comando 'team --list' para ver la lista de estos.`);
      return;
    }
    const option = Object.keys(args)[0]
    switch (option) {
      case 'status':
        status({ bot, channel, userId, team, args });
        break;
      case 'user-add':
        userAdd({ bot, channel, userId, teamName, args });
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
        bot.postEphemeral(channel, userId, 'ups! Debes ingresar un comando para equipo.');
    }
  });
};

export default team;
