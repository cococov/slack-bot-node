import { gitlabBurden } from './commads/gitlab_burden.js';

export const dispatcher = ({ bot, userId, command, params = [] }) => {
  switch (command) {
    case 'carga':
      gitlabBurden({ bot });
      break;
    default:
      bot.postMessageToChannel('general', `No te entiendo :sad-parrot:`);
  }
};

export default dispatcher