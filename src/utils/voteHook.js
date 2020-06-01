const Discord = require('discord.js');
const BotList = require('botlist.space');
const BotListWebhook = require('webhook.space');

const users = require('../models/user.js');

module.exports.startUp = async (client) => {
    const Webhook = new BotListWebhook.Webhook({ port: 9837, path: '/', token: process.env.BOTLISTSPACE_TOKEN });

    Webhook.close().open();

    Webhook.on('upvote', (body, headers) => {
        console.log(body);
        console.log(headers);
    });

    // const listClient = new BotList.WebSocket({
    //     tokens: [process.env.BOTLISTSPACE_TOKEN, process.env.BOTLISTSPACE_WEBHOOK_URL],
    //     reconnect: true,
    // });

    // listClient.on('connected', () => {
    //     console.log('Successfully connected to the botlist.space gateway');
    // });

    // listClient.on('view', (event) => {
    //     console.log(event.bot.username);
    // });

    // listClient.on('invite', (event) => {
    //     console.log('Someone has invited one of my bots: ' + event.bot.username);
    // });

    // listClient.on('upvote', async (voter) => {
    //     console.log(voter);
    //     try {
    //         const votedUser = await client.users.fetch(voter.user);

    //         users.findOne({
    //             authorID: votedUser.id,
    //         }, async (err, u) => {
    //             if (err) console.log(err);
    //             if (!u) {
    //                 const newUser = new users({
    //                     authorID: votedUser.id,
    //                     bio: '',
    //                     songsPlayed: 0,
    //                     commandsUsed: 0,
    //                     blocked: false,
    //                     premium: false,
    //                     pro: false,
    //                     developer: false,
    //                     voted: true,
    //                     timesVoted: 1,
    //                     votedConst: true,
    //                     lastVoted: Date.now(),
    //                 });
    //                 await newUser.save().catch(e => console.log(e));
    //             }
    //             else {
    //                 u.voted = true;
    //                 u.votedConst = true;
    //                 await u.save().catch(e => console.log(e));
    //             }

    //             const embed = new Discord.MessageEmbed()
    //                 .setAuthor(`${votedUser.tag} - (${votedUser.id})`, votedUser.displayAvatarURL())
    //                 .setDescription(`**${votedUser.username}** voted for the bot!`)
    //                 .setThumbnail(votedUser.displayAvatarURL())
    //                 .setColor(client.colors.main)
    //                 .setTimestamp();

    //             client.shardMessage(client, client.channelList.dblChannel, embed);
    //         });
    //     }
    //     catch (e) {
    //         client.log(e);
    //     }
    // });

    // listClient.on('close', (event) => {
    //     console.log('The gateway was closed', event);
    // });
};