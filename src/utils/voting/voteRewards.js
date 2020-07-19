const Discord = require('discord.js');

const users = require('../../models/user.js');

module.exports = async (client, user) => {
    users.findOne({
        authorID: user.id,
    }, async (err, u) => {
        if (err) console.log(err);
        // eslint-disable-next-line no-unused-vars
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
            lastVotedTime = Date(u.lastVoted).toString().substring(0, 15);
            u.lastVoted = Date.now();
            u.voted = true;
            u.votedConst = true;
            await u.save().catch(e => console.log(e));
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${user.tag} - (${user.id})`, user.displayAvatarURL())
            .setDescription(`**${user.username}** voted for the bot!\n\nTimes Voted: \`${u.votedTimes}\``)
            .setThumbnail(user.displayAvatarURL())
            .setColor(client.colors.main)
            .setTimestamp();

        client.shardMessage(client, client.channelList.voteChannel, embed);

        return user.send('Thank you for voting. You can now use filter commands! (You can vote again in 12 hours)');
    });
};