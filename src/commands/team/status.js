import fetch from 'node-fetch';
import { jsonResponseFormatter } from '../../util/util.js'

const GITLAB_BASE_URL = 'https://gitlab.com/api/v4/projects/3310437/merge_requests?state=opened';
const GITLAB_API_KEY = process.env.GITLAB_API_KEY;

/**
 *
 * @param members
 * @returns {Promise<any[]>}
 */
const getBurden = async (members = []) => {

    /**
     * prepare gitlab request promises
     */
    const reqPromises = members.map(async (member, index) => {

        const url = `${GITLAB_BASE_URL}&assignee_id=${member['id']}&not[author_username]=bukhr-tech`;
        const opts = { method: 'GET', headers: { 'Authorization': `Bearer ${GITLAB_API_KEY}` } };

        return fetch(url, opts).then(raw => raw.json());
    });

    /**
     * await for all request execution
     */
    let result = []
    try {
        result = await Promise.all(reqPromises);
    } catch (e) {
        console.error('An error has occurred: ', JSON.stringify(e));
    }

    return result;
};

export const status = async ({ bot, channel, userId, team }) => {

    const members = team['members'] ?? [];
    const heroes = team['heroes'] ?? [];

    const burden = await getBurden(members);

    /**
     * building status response
     */
    const burdens = members.reduce((previous, current, index) => {
        return `${previous}\n  ${current['username']}: ${burden[index].length},`
    }, '');

    const message = jsonResponseFormatter(`members = {${burdens}\n}\nheroes = [${heroes.join(', ')}]`)

    bot.postEphemeral(channel, userId, message, null);
};
