import * as cmds from './commands/index.js';

export const dispatcher = ({ bot, channel, userId, command, subcommand, args }) => {

  const commandExists = Object.prototype.hasOwnProperty.call(cmds, command);

  commandExists ? cmds[command]({ bot, channel, userId, subcommand, args })
    : bot.postEphemeral(channel, userId, 'No te entiendo :sad-parrot:')
};

export default dispatcher
