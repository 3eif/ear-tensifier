const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Tempo extends Command {
    constructor(client) {
        super(client, {
            name: 'tempo',
            description: {
                content: 'Sets the tempo of the player.',
                usage: '<tempo (0.5 to 10)>',
                examples: ['0.7', '1.3', '6'],
            },
            aliases: ['speed'],
            args: true,
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'on',
                    description: 'Sets the tempo of the player.',
                    type: 1,
                    options: [
                        {
                            name: 'amount',
                            type: 10,
                            required: true,
                            description: 'The amount to set the tempo to.',
                            min_value: 0.5,
                            max_value: 10,
                        },
                    ],
                },
                {
                    name: 'off',
                    description: 'Sets the tempo back to 1.',
                    type: 1,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);

        if ((ctx.isInteraction && ctx.interaction.options.data[0].name == 'off') || (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off'))) {
            player.filter.resetTempo();
            const embed = new MessageEmbed()
                .setAuthor('Tempo has been reset to 1x', ctx.author.displayAvatarURL())
                .setColor(client.config.colors.default);
            return ctx.sendMessage({ content: null, embeds: [embed] });
        }

        if (isNaN(args[0]) && ctx.isInteraction) args[0] = ctx.interaction.options.data[0].options[0].value;
        else if (isNaN(args[0])) return ctx.sendMessage('Amount must be a real number.');
        if (args[0] > 3 || args[0] < 0.5) return ctx.sendMessage('Amount must be between 0.5 and 3.');

        player.filter.setTempo(args[0]);
        const embed = new MessageEmbed()
            .setAuthor(`Tempo set to ${args[0]}x`, ctx.author.displayAvatarURL())
            .setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};