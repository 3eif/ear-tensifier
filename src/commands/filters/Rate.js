const { ApplicationCommandOptionType } = require('discord-api-types');
const { EmbedBuilder } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Rate extends Command {
    constructor(client) {
        super(client, {
            name: 'rate',
            description: {
                content: 'Sets the rate of the player.',
                usage: '<rate (0 to 3)>',
                examples: ['0.7', '1.3', '6'],
            },
            aliases: ['pitch'],
            args: true,
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'on',
                    description: 'Sets the rate of the player.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'amount',
                            type: ApplicationCommandOptionType.Number,
                            required: true,
                            description: 'The amount to set the rate to.',
                            min_value: 0,
                            max_value: 3,
                        },
                    ],
                },
                {
                    name: 'off',
                    description: 'Sets the rate back to 1.',
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        if (ctx.guild.id == '441290611904086016') return;

        const player = client.music.players.get(ctx.guild.id);

        if ((ctx.isInteraction && ctx.interaction.options.data[0].name == 'off') || (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off'))) {
            player.filter.resetRate();
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Rate has been reset to 1x', iconURL: ctx.author.displayAvatarURL() })
                .setColor(client.config.colors.default);
            return ctx.sendMessage({ content: null, embeds: [embed] });
        }

        if (isNaN(args[0]) && ctx.isInteraction) args[0] = ctx.interaction.options.data[0].options[0].value;
        else if (isNaN(args[0])) return ctx.sendMessage('Amount must be a real number.');
        if (args[0] > 3 || args[0] < 0) return ctx.sendMessage('Amount must be between 0 and 3.');

        player.filter.setRate(args[0]);
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Rate set to ${args[0]}x`, iconURL: ctx.author.displayAvatarURL() })
            .setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};