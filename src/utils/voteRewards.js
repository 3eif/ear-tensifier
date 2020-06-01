const Discord = require('discord.js');

const users = require('../models/user.js');

module.exports = async (client, user) => {    
    users.findOne({
        authorID: user.id,
    }, async (err, u) => {
        if (err) console.log(err);
        let lastVotedTime = 'Never';
        if (!u) {
            const newUser = new users({
                authorID: user.id,
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
            const epoch = u.lastVoted;
            lastVotedTime = new Date(epoch);
            lastVotedTime.toLocaleDateString();
            u.lastVoted = Date.now();
            u.voted = true;
            u.votedConst = true;
            await u.save().catch(e => console.log(e));
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${user.tag} - (${user.id}})`, user.displayAvatarURL())
            .setDescription(`**${user.username}** voted for the bot!`)
            .addField('Times Voted', u.votedTimes, true)
            .addField('Last Voted', lastVotedTime, true)
            .setThumbnail(user.displayAvatarURL())
            .setColor(client.colors.main)
            .setTimestamp();

        client.shardMessage(client, client.channelList.dblChannel, embed);
    });
};