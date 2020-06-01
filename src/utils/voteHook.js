const Discord = require('discord.js');
const BotList = require('botlist.space');
const BotListWebhook = require('webhook.space');

const voteRewards = require('./voteRewards.js')

module.exports.startUp = async (client) => {
    const Webhook = new BotListWebhook.Webhook({ port: 9837, path: '/', token: process.env.BOTLISTSPACE_TOKEN });

    Webhook.close().open();

    Webhook.on('upvote', (body) => {
        const user = await client.users.fetch(body.user.id);
        voteRewards(client, user);
    });
};