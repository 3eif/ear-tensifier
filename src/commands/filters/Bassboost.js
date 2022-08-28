const { ApplicationCommandOptionType } = require('discord-api-types');
const { EmbedBuilder } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Bassboost extends Command {
    constructor(client) {
        super(client, {
            name: 'bassboost',
            description: {
                content: 'Bassboosts the player.',
                usage: '[amount (-10 to 10)]',
                examples: ['bassboost -10', 'bassboost 0', 'bassboost 10'],
            },
            aliases: ['bb', 'bass'],
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'on',
                    description: 'Turns on the bassboost filter.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'amount',
                            type: ApplicationCommandOptionType.Number,
                            required: false,
                            description: 'The amount to bassboost the player.',
                            min_value: -10,
                            max_value: 10,
                        },
                    ],
                },
                {
                    name: 'off',
                    description: 'Turns off the bassboost filter.',
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
            player.filter.setBassboost(false);
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Turned off bassboost', iconURL: ctx.author.displayAvatarURL() })
                .setColor(client.config.colors.default);
            return ctx.sendMessage({ content: null, embeds: [embed] });
        }

        if (!args[0] || args[0].toLowerCase() == 'on') {
            player.filter.setBassboost(true);
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Turned on bassboost', iconURL: ctx.author.displayAvatarURL() })
                .setColor(client.config.colors.default);
            return ctx.sendMessage({ content: null, embeds: [embed] });
        }

        if (isNaN(args[0])) return ctx.sendMessage('Amount must be a real number.');

        player.filter.setBassboost(true, args[0]);
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Bassboost set to ${args[0]}`, iconURL: ctx.author.displayAvatarURL() })
            .setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};