const { EmbedBuilder } = require('discord.js');

const DatabaseHelper = require('../../helpers/DatabaseHelper');
const Event = require('../../structures/Event');
const formatDuration = require('../../utils/formatDuration');

module.exports = class TrackEnd extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(player, track, finished) {
        player.queue.previous = track;

        const shouldSend = await DatabaseHelper.shouldSendNowPlayingMessage(player.textChannel.guild);

        try {
            // if (player.nowPlayingMessageInterval) {
            //     clearInterval(player.nowPlayingMessageInterval);
            //     player.nowPlayingMessageInterval = null;
            // }
            if (!shouldSend || !player.nowPlayingMessage) return;

            const duration = track.duration;
            const parsedDuration = formatDuration(duration);

            const newNowPlayingEmbed = EmbedBuilder.from(player.nowPlayingMessage.embeds[0]);

            if (finished) newNowPlayingEmbed.setDescription(`${parsedDuration}  ${this.client.config.emojis.progress1}${this.client.config.emojis.progress2.repeat(13)}${this.client.config.emojis.progress8}  ${parsedDuration}`);
            newNowPlayingEmbed.setAuthor({ name: track.author, iconURL: 'https://eartensifier.net/images/cd.png', url: track.url });

            await player.nowPlayingMessage.edit({ components: [], embeds: [newNowPlayingEmbed] });
        }
        catch (e) {
            this.client.logger.error(e);
        }
    }
};