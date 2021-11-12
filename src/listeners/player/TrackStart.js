const Discord = require('discord.js');

const Event = require('../../structures/Event');
const formatDuration = require('../../utils/music/formatDuration');
const User = require('../../models/User');
const Bot = require('../../models/Bot');
const Song = require('../../models/Bot');

module.exports = class TrackStart extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(player, track) {
        const { id, title, url, duration, platform, requester } = track;
        const author = track.owner_name;
        const thumbnail = track.thumbnails[0].url;

        // Song.findOne({
        //     songID: id,
        // }, async (err, s) => {
        //     if (err) console.log(err);
        //     if (!s) {
        //         const newSong = new Song({

        //         });
        //         await newSong.save().catch(e => this.client.logger.error(e));
        //     }
        //     else {
        //         s.timesPlayed += 1;
        //         await s.save().catch(e => this.client.logger.error(e));
        //     }
        // });

        // Bot.findOne({
        //     clientID: this.client.user.id,
        // }, async (err, b) => {
        //     if (err) this.client.logger.error(err);
        //     b.songsPlayed += 1;
        //     await b.save().catch(e => this.client.logger.error(e));
        // });

        // User.findOne({ authorID: (!requester.id ? track.requester : track.requester.id) }).then(async messageUser => {
        //     if (!messageUser) {
        //         const newUser = new User({
        //             authorID: requester.id,
        //             bio: '',
        //             songsPlayed: 1,
        //             commandsUsed: 0,
        //             blocked: false,
        //             premium: false,
        //             pro: false,
        //             developer: false,
        //         });
        //         await newUser.save().catch(e => this.client.logger.error(e));
        //     }
        //     else {
        //         messageUser.songsPlayed++;
        //         await messageUser.save().catch(e => this.client.logger.error(e));
        //     }
        // });

        const embed = new Discord.MessageEmbed()
            .setColor(this.client.config.colors.default)
            .setAuthor('Now Playing', 'https://cdn.discordapp.com/emojis/673357192203599904.gif?v=1')
            .setThumbnail(thumbnail)
            .setDescription(`**[${title}](${url})** [${formatDuration(duration)}]`)
            .addField('Author', author, true)
            .addField('Requested by', `<@${requester.id}>`, true)
            .setFooter(platform)
            .setTimestamp();
        player.textChannel.send({ embeds: [embed] });
    }
};