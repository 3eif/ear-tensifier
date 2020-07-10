const BotListWebhook = require('webhook.space');
const voteRewards = require('../utils/voting/voteRewards.js');

module.exports.startUp = async (client) => {
    const Webhook = new BotListWebhook.Webhook({ port: 9837, path: '/', token: process.env.BOTLISTSPACE_TOKEN });

    Webhook.close().open();

    Webhook.on('upvote', async (body) => {
        const user = await client.users.fetch(body.user.id);
        voteRewards(client, user);
    });
};