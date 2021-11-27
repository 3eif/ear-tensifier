const { MessageEmbed } = require('discord.js');

const Filter = require('../../structures/Filter');
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
                    type: 1,
                    options: [
                        {
                            name: 'amount',
                            type: 10,
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
                .setAuthor('Turned off bassboost', ctx.author.displayAvatarURL())
                .setColor(client.config.colors.default);
            return ctx.sendMessage({ content: null, embeds: [embed] });
        }

        if (!args[0] || args[0].toLowerCase() == 'on') {
            player.setFilter(new Filter.Bassboost(player));
            const embed = new MessageEmbed()
                .setAuthor('Turned on bassboost', ctx.author.displayAvatarURL())
                .setColor(client.config.colors.default);
            return ctx.sendMessage({ content: null, embeds: [embed] });
        }

        if (isNaN(args[0])) return ctx.sendMessage('Amount must be a real number.');

        player.setFilter(new Filter.Bassboost(player, args[0]));
        const embed = new MessageEmbed()
            .setAuthor(`Bassboost set to ${args[0]}`, ctx.author.displayAvatarURL())
            .setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};