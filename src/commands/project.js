import * as actions from "./project/index.js";

/**
 * object maps cli args vs action names
 * @type {{}}
 */
const CLI_MAPPED_ACTIONS = {}

export const project = async ({ bot, channel, userId, subcommand, args }) => {

    // parse desired action
    let action = Object.keys(args)[0];

    // transform cli actions to application code actions
    action = Object.prototype.hasOwnProperty.call(CLI_MAPPED_ACTIONS, action) ? CLI_MAPPED_ACTIONS[action] : action;


    // validate action
    const actionExists = Object.prototype.hasOwnProperty.call(actions, action);
    if (!actionExists) {
        bot.postEphemeral(channel, userId, 'Debes ingresar una opción válida para el comando project.', null);
        return;
    }

    /**
     * execute action
     */
    actions[action]({ bot, channel, userId, subcommand, args });
};
