import { firebase } from '@firebase/app';
import '@firebase/database';
import { list } from './project/index.js';

export const project = async ({ bot, channel, userId, subcommand, args }) => {
	const option = Object.keys(args)[0];
	
	switch (option) {
		case 'list':
			list({ bot, channel, userId, args });
			break;
		default:
			bot.postEphemeral(channel, userId, 'Debes ingresar una opción válida para el comando project.');
	}
};

export default project;