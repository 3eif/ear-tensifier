const Discord = require('discord.js');

const Event = require('../../structures/Event');
const formatDuration = require('../../utils/music/formatDuration');

module.exports = class TrackStart extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(player, track) {
        const { id, title, url, duration, platform, requester } = track;
        const author = track.owner_name;
        const thumbnail = track.thumbnails[0].url;

        this.client.databaseHelper.incrementTotalSongsPlayed();
        this.client.databaseHelper.incrementTimesSongPlayed(id, title, url, duration, platform, thumbnail, author);
        this.client.databaseHelper.incrementUserSongsPlayed(requester);

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