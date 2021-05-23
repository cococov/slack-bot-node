export const dispatcher = ({ bot, userId, command, params = [] }) => {
  switch (command) {
    default:
      bot.postMessageToChannel('general', `No te entiendo :sad-parrot:`);
  }
};

export default dispatcher