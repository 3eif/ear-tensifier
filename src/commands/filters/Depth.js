const { ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Depth extends Command {
    constructor(client) {
        super(client, {
            name: 'depth',
            description: {
                content: 'Sets the tremolo\'s depth of the player.',
                usage: '<depth (0 to 100)>',
                examples: ['0.7', '1', 0.5],
            },
            aliases: ['tremolo-depth'],
            args: true,
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'on',
                    description: 'Sets the tremolo\'s depth of the player.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'amount',
                            type: ApplicationCommandOptionType.Number,
                            required: true,
                            description: 'The amount to set the depth to.',
                            min_value: 0,
                            max_value: 100,
                        },
                    ],
                },
                {
                    name: 'off',
                    description: 'Sets the tremolo\'s depth back to 50%.',
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);

        if ((ctx.isInteraction && ctx.interaction.options.data[0].name == 'off') || (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off'))) {
            player.filter.resetDepth();
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Depth has been reset to 0%', iconURL: ctx.author.displayAvatarURL() })
                .setColor(client.config.colors.default);
            return ctx.sendMessage({ content: null, embeds: [embed] });
        }

        if (isNaN(args[0]) && ctx.isInteraction) args[0] = ctx.interaction.options.data[0].options[0].value;
        else if (isNaN(args[0])) return ctx.sendMessage('Amount must be a real number.');
        if (args[0] > 100 || args[0] < 0) return ctx.sendMessage('Amount must be between 0 and 100.');

        player.filter.setTremolo(args[0] / 100, player.filter.tremolo.frequency);

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Depth set to ${args[0]}%`, iconURL: ctx.author.displayAvatarURL() })
            .setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};