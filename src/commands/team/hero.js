import { firebase } from '@firebase/app';
import '@firebase/database';

const ERROR_MESSAGE = 'Ha ocurrido un error :banana:';


/**
 * Grab a team and add a brand new hero
 * @param bot bot
 * @param channel channel
 * @param userId slack user
 * @param team used team
 * @param teamName team name
 * @param args arguments #user_name **rm** or **set**
 */
export const add = async ({ bot, channel, userId, team, teamName, args }) => {

    // initialize heroes
    team.heroes = team.heroes ?? [];

    // parsing username from args
    const usernames = Object.values(args);

    // check user should be a team member
    if (!usernames.every(u => team.members?.find(tm => tm.username === u))) {
        bot.postEphemeral(channel, userId,
            'El usuario debe ser parte del equipo :banana:', null);
        return;
    }

    // add hero
    usernames.forEach(u => team.heroes = !team.heroes.includes(u) ? team.heroes?.concat([u]) : team.heroes);

    // find team to be modified
    const tref = firebase.database().ref('teams')
    let teams = [];
    try {
        teams = (await tref.once('value')).val();
    } catch (e) {
        console.error('An error has occurred: ', JSON.stringify(e));
        bot.postEphemeral(channel, userId, ERROR_MESSAGE, null);
        return;
    }
    const index = teams.findIndex(t => t.name === teamName);

    // update team info
    teams[index] = team;
    await tref.set(teams);

    bot.postEphemeral(channel, userId, `Héroe(s) *${usernames.join(', ')}* agregado a ${team.name} :party-parrot:`, null);
}

/**
 * Grab a team and remove the desired hero
 * @param bot slack bot
 * @param channel slack channel
 * @param userId slack user
 * @param team team
 * @param teamName team name
 * @param args arguments
 */
export const rm = async ({ bot, channel, userId, team, teamName, args }) => {

    // initialize heroes
    team.heroes = team.heroes ?? [];

    // parsing username from args
    const usernames = Object.values(args);

    // check if user is a team member
    if (!usernames.every(u => team.members?.find(tm => tm.username === u))) {
        bot.postEphemeral(channel, userId, 'El usuario debe ser parte del equipo :banana:', null);
        return;
    }

    // rm hero
    team.heroes = team.heroes.filter(h => !usernames.includes(h));

    // find team to be modified
    const tref = firebase.database().ref('teams')
    let teams = [];
    try {
        teams = (await tref.once('value')).val();
    } catch (e) {
        console.error('An error has occurred: ', JSON.stringify(e));
        bot.postEphemeral(channel, userId, ERROR_MESSAGE, null);
        return;
    }
    const index = teams.findIndex(t => t.name === teamName);

    // update team info
    teams[index] = team;
    await tref.set(teams);

    bot.postEphemeral(channel, userId, `Héroe(s) *${usernames.join(', ')}* removido de ${team.name} :party-parrot:`, null);
}
