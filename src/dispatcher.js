import { gitlabBurden, team } from './commands/index.js';

export const dispatcher = ({ bot, channel, userId, command, subcommand, args }) => {
  switch (command) {
    case 'carga':
      gitlabBurden({ bot, channel });
      break;
    case 'team':
      team({ bot, channel, userId, subcommand, args });
      break;
    default:
      bot.postMessage(channel, 'No te entiendo :sad-parrot:');
  }
};

export default dispatcher
