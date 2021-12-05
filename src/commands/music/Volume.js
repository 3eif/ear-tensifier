const Command = require('../../structures/Command');

const { MessageEmbed } = require('discord.js');

module.exports = class Volume extends Command {
    constructor(client) {
        super(client, {
            name: 'volume',
            description: {
                content: 'Sets the volume of the player.',
                usage: '[volume level (default is 100)]',
            },
            voiceRequirements: {
                isInVoiceChannel: true,
                inSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'volume',
                    type: 4,
                    required: false,
                    description: 'The volume level to set the player to (default is 100).',
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);

        if (!args[0]) return ctx.sendMessage(`The current volume is set to: **${player.volume}%**`);

        if (args[0].toString().toLowerCase() == 'reset') {
            player.filter.resetVolume();
            const embed = new MessageEmbed()
                .setAuthor(`Volume has been reset to ${volume}%`, ctx.author.displayAvatarURL())
                .setColor(client.config.colors.default);
            return ctx.sendMessage({ embeds: [embed] });
        }

        if (isNaN(args[0])) return ctx.sendMessage('Invalid number.');

        const volume = Number(args[0]);
        player.filter.setVolume(volume);

        const embed = new MessageEmbed()
            .setAuthor(`Volume set to ${volume}%`, ctx.author.displayAvatarURL())
            .setColor(client.config.colors.default);
        return ctx.sendMessage({ embeds: [embed] });
    }
};