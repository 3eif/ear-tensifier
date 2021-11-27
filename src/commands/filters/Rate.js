const { MessageEmbed } = require('discord.js');

const Filter = require('../../structures/Filter');
const Command = require('../../structures/Command');

module.exports = class Rate extends Command {
    constructor(client) {
        super(client, {
            name: 'rate',
            description: {
                content: 'Sets the rate of the player.',
                usage: '<rate (0 to 10)>',
                examples: ['bassboost -10', 'bassboost 0', 'bassboost 10'],
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
                    type: 1,
                    options: [
                        {
                            name: 'amount',
                            type: 4,
                            required: true,
                            description: 'The amount to set the rate to (0 to 10).',
                        },
                    ],
                },
                {
                    name: 'off',
                    description: 'Sets the rate back to 1.',
                    type: 1,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);

        if ((ctx.isInteraction && ctx.interaction.options.data[0].name == 'off') || (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off'))) {
            player.resetFilter();
            const embed = new MessageEmbed()
                .setAuthor('Rate has been reset', ctx.author.displayAvatarURL())
                .setColor(client.config.colors.default);
            return ctx.sendMessage({ content: null, embeds: [embed] });
        }

        if (isNaN(args[0])) return ctx.sendMessage('Amount must be a real number.');

        player.setFilter(new Filter.Rate(player, args[0]));
        const embed = new MessageEmbed()
            .setAuthor(`Rate set to ${args[0]}`, ctx.author.displayAvatarURL())
            .setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};