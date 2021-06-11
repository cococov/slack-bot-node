import { firebase } from '@firebase/app';
import '@firebase/database';

export const list = async ({ bot, channel, userId, args }) => {
	firebase.database().ref(`projects`).once('value').then(snapshot => {
		const projects = snapshot.val();
		const message = projects.reduce((previous, current, index) => {
			return `Lista de Proyectos (nompre:id):\n${previous}\n${current['name']}: ${current['id']}`
		}, '');

		bot.postEphemeral(channel, userId, message);		
	});
};