const { MessageEmbed } = require('discord.js');

const Event = require('../../structures/Event');

module.exports = class QueueEnd extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(player) {
        const n = Math.floor(Math.random() * 3);
        let msg = '';

        switch (n) {
            case 0:
                msg = 'Enjoying Ear Tensifier? Consider reviewing it **[here](https://bots.ondiscord.xyz/bots/472714545723342848/review)**.';
                break;
            case 1:
                msg = 'Enjoying Ear Tensifier? Consider voting for it **[here](https://top.gg/bot/472714545723342848/vote)**.';
                break;
            case 2:
                msg = 'Enjoying Ear Tensifier? Consider becoming a Patreon supporter **[here](https://www.patreon.com/eartensifier)**.';
                break;

            default:
                msg = '';
                break;
        }

        const embed = new MessageEmbed()
            .setDescription('Queue ended. ' + msg)
            .setColor(this.client.config.colors.default);
        player.textChannel.send({ embeds: [embed] });
        player.cleanup();
        return player.destroy(false);
    }
};