const Command = require('../../structures/Command');
const { EmbedBuilder } = require('discord.js');

module.exports = class Reset extends Command {
    constructor(client) {
        super(client, {
            name: 'reset',
            description: {
                content: 'Resets all filters applied on the player.',
            },
            aliases: ['normal'],
            voiceRequirements: {
                isInVoiceChannel: true,
                inSameVoiceChannel: true,
                isPlaying: true,
            },
            slashCommand: true,
        });
    }
    async run(client, ctx) {
        const player = client.music.players.get(ctx.guild.id);
        player.filter.resetAll();

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'All filters have been reset', iconURL: ctx.author.displayAvatarURL() })
            .setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};