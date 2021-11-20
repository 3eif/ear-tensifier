const { MessageEmbed } = require('discord.js');
const Event = require('../../structures/Event');

module.exports = class TrackEnd extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(player, track) {
        const embed = new MessageEmbed(player.nowPlayingMessage.embeds[0].setAuthor('Finished Playing', 'https://eartensifier.net/images/cd.png'));
        player.nowPlayingMessage.edit({ content: null, embeds: [embed] });
        player.queue.previous.push(track);
    }
};