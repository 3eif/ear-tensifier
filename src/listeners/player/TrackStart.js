const { MessageEmbed } = require('discord.js');

const DatabaseHelper = require('../../helpers/DatabaseHelper');
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

        const shouldSend = await DatabaseHelper.shouldSendNowPlayingMessage(player.textChannel.guild);
        if (!shouldSend) return;

        const n = 13;
        let parsedCurrentDuration = formatDuration(player.getTime());
        let parsedDuration = formatDuration(duration);
        let part = Math.floor((player.getTime() / duration) * n);
        let percentage = player.getTime() / duration;

        const embed = new MessageEmbed()
            .setColor(this.client.config.colors.default)
            .setAuthor(author, player.playing ? 'https://eartensifier.net/images/cd.gif' : 'https://eartensifier.net/images/cd.png', url)
            .setThumbnail(thumbnail)
            .setTitle(title)
            .setDescription(`${parsedCurrentDuration}  ${percentage < 0.05 ? this.client.config.emojis.progress7 : this.client.config.emojis.progress1}${this.client.config.emojis.progress2.repeat(part)}${percentage < 0.05 ? '' : this.client.config.emojis.progress3}${this.client.config.emojis.progress5.repeat(12 - part)}${this.client.config.emojis.progress6}  ${parsedDuration}`)
            .setFooter(requester.username)
            .setTimestamp();
        player.nowPlayingMessage = await player.textChannel.send({ embeds: [embed] });

        player.nowPlayingMessage.interval = setInterval(() => {
            parsedCurrentDuration = formatDuration(player.getTime());
            parsedDuration = formatDuration(duration);
            part = Math.floor((player.getTime() / duration) * n);
            percentage = player.getTime() / duration;

            const e = new MessageEmbed(embed.setDescription(`${parsedCurrentDuration}  ${percentage < 0.05 ? this.client.config.emojis.progress7 : this.client.config.emojis.progress1}${this.client.config.emojis.progress2.repeat(part)}${percentage < 0.05 ? '' : this.client.config.emojis.progress3}${this.client.config.emojis.progress5.repeat(12 - part)}${this.client.config.emojis.progress6}  ${parsedDuration}`));
            player.nowPlayingMessage.edit({ content: null, embeds: [e] });
        }, 5000);
    }
};