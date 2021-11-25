const { MessageEmbed } = require('discord.js');

const DatabaseHelper = require('../../helpers/DatabaseHelper');
const Event = require('../../structures/Event');
const formatDuration = require('../../utils/music/formatDuration');

module.exports = class TrackEnd extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(player, track, finished) {
        const shouldSend = await DatabaseHelper.shouldSendNowPlayingMessage(player.textChannel.guild);
        if (!shouldSend || !player.nowPlayingMessage) return;

        const parsedDuration = formatDuration(track.duration);
        const embed = new MessageEmbed(player.nowPlayingMessage.embeds[0].setAuthor(track.author, 'https://eartensifier.net/images/cd.png'));
        if(finished) embed.setDescription(`${parsedDuration}  ${this.client.config.emojis.progress1}${this.client.config.emojis.progress2.repeat(13)}${this.client.config.emojis.progress8}  ${parsedDuration}`);
        player.nowPlayingMessage.edit({ content: null, embeds: [embed] });

        clearInterval(player.nowPlayingMessage.interval);
        player.queue.previous.push(track);
    }
};