import { firebase } from '@firebase/app';
import '@firebase/database';
import * as actions from './team/index.js';

/**
 * create action name
 * @type {string}
 */
const CREATE_ACTION = actions.create.name;

/**
 * object maps cli args vs action names
 * @type {{"user-add": string, "user-rm": string}}
 */
const CLI_MAPPED_ACTIONS = {
    'user-add': 'userAdd',
    'user-rm': 'userRemove',
    'hero-add': 'heroAdd',
    'hero-rm': 'heroRm',
}

export default async ({ bot, channel, userId, subcommand: teamName, args }) => {

    if (!teamName) {
        bot.postEphemeral(channel, userId, 'ups! Debes ingresar un equipo.', null);
        return;
    }

    // parse desired action
    let action = Object.keys(args)[0]

    // transform cli actions to application code actions
    action = Object.prototype.hasOwnProperty.call(CLI_MAPPED_ACTIONS, action) ? CLI_MAPPED_ACTIONS[action] : action;

    /**
     * Preload team info based on subcommand
     */
    let ref = firebase.database().ref(`teams`);
    const snapshot = await ref.once('value')

    const team = snapshot.val().find(it => it.name === teamName);
    if (!team && action !== CREATE_ACTION) {
        bot.postEphemeral(channel, userId, `ups! El equipo ${teamName} no existe :sad-parrot: Prueba el comando 'help' para ver la lista de comandos.`, null);
        return;
    }

    // validate action
    const actionExists = Object.prototype.hasOwnProperty.call(actions, action);
    if (!actionExists) {
        bot.postEphemeral(channel, userId, 'ups! Debes ingresar un comando para equipo.', null);
        return;
    }

    /**
     * execute action
     */
    actions[action]({ bot, channel, userId, team, teamName, args });
};
