const { MessageEmbed } = require('discord.js');

const DatabaseHelper = require('../../helpers/DatabaseHelper');
const Event = require('../../structures/Event');

module.exports = class TrackEnd extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(player, track) {
        const shouldSend = await DatabaseHelper.shouldSendNowPlayingMessage(player.textChannel.guild);
        if (!shouldSend || !player.nowPlayingMessage) return;
        const embed = new MessageEmbed(player.nowPlayingMessage.embeds[0].setAuthor('Finished Playing', 'https://eartensifier.net/images/cd.png'));
        player.nowPlayingMessage.edit({ content: null, embeds: [embed] });
        player.queue.previous.push(track);
    }
};