const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

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
        player.resetAllFilters();

        const embed = new MessageEmbed()
            .setAuthor('All filters have been reset', ctx.author.displayAvatarURL())
            .setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};