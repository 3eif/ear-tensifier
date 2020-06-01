const Discord = require('discord.js');
const BotList = require('botlist.space');
const BotListWebhook = require('webhook.space');

const users = require('../models/user.js');

module.exports.startUp = async (client) => {
    const Webhook = new BotListWebhook.Webhook({ port: 9837, path: '/', token: process.env.BOTLISTSPACE_TOKEN });

    Webhook.close().open();

    Webhook.on('upvote', async (body) => {
        const timestamp = body.timestamp;
        const avatar = body.avatar;
        const userID = body.user.id;
        const username = `${body.user.username}#${body.user.discriminator}`
        
        try {
            const votedUser = await client.users.fetch(userID);

            users.findOne({
                authorID: userID,
            }, async (err, u) => {
                if (err) console.log(err);
                if (!u) {
                    const newUser = new users({
                        authorID: userID,
                        bio: '',
                        songsPlayed: 0,
                        commandsUsed: 0,
                        blocked: false,
                        premium: false,
                        pro: false,
                        developer: false,
                        voted: true,
                        votedTimes: 1,
                        votedConst: true,
                        lastVoted: Date.now(),
                    });
                    await newUser.save().catch(e => console.log(e));
                }
                else {
                    if(!Number.isInteger(u.votedTimes)) u.votedTimes = 1;
                    else u.votedTimes++;
                    u.lastVoted = Date.now();
                    u.voted = true;
                    u.votedConst = true;
                    await u.save().catch(e => console.log(e));
                }

                const embed = new Discord.MessageEmbed()
                    .setAuthor(`${username} - (${userID}})`, votedUser.displayAvatarURL())
                    .setDescription(`**${username}** voted for the bot!`)
                    .addField('Times Voted', u.votedTimes)
                    .setThumbnail(votedUser.displayAvatarURL())
                    .setColor(client.colors.main)
                    .setTimestamp();

                client.shardMessage(client, client.channelList.dblChannel, embed);
            });
        }
        catch (e) {
            client.log(e);
        }
    });
};