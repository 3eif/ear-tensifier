const Discord = require('discord.js');

const Event = require('../../structures/Event');
const formatDuration = require('../../utils/music/formatDuration');

module.exports = class TrackStart extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(player, track) {
        const { id, title, url, duration, platform, requester, author, thumbnail } = track;

        this.client.databaseHelper.incrementTotalSongsPlayed();
        this.client.databaseHelper.incrementTimesSongPlayed(id, title, url, duration, platform, thumbnail, author);
        this.client.databaseHelper.incrementUserSongsPlayed(requester);

        const embed = new Discord.MessageEmbed()
            .setColor(this.client.config.colors.default)
            .setAuthor('Now Playing', 'https://eartensifier.net/images/cd.gif')
            .setThumbnail(thumbnail)
            .setDescription(`**[${title}](${url})** [${formatDuration(duration)}]`)
            .addField('Author', author, true)
            .addField('Requested by', `<@${requester.id}>`, true)
            .setFooter(platform)
            .setTimestamp();
        player.nowPlayingMessage = await player.textChannel.send({ embeds: [embed] });
    }
};