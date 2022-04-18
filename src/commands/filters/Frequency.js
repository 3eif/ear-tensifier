const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Frequency extends Command {
    constructor(client) {
        super(client, {
            name: 'frequency',
            description: {
                content: 'Sets the tremolo\'s frequency of the player.',
                usage: '<frequency (0.1 to 20000)>',
                examples: ['5', '100'],
            },
            aliases: ['tremolo-frequency'],
            args: true,
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'on',
                    description: 'Sets the tremolo\'s frequency of the player.',
                    type: 1,
                    options: [
                        {
                            name: 'amount',
                            type: 10,
                            required: true,
                            description: 'The amount to set the frequency to.',
                            min_value: 0.1,
                            max_value: 20000,
                        },
                    ],
                },
                {
                    name: 'off',
                    description: 'Sets the tremolo\'s frequency back to 5.0Hz.',
                    type: 1,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        if (ctx.guild.id == '441290611904086016') return;

        const player = client.music.players.get(ctx.guild.id);

        if ((ctx.isInteraction && ctx.interaction.options.data[0].name == 'off') || (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off'))) {
            player.filter.resetFrequency();
            const embed = new MessageEmbed()
                .setAuthor('Frequency has been reset to 5.0Hz', ctx.author.displayAvatarURL())
                .setColor(client.config.colors.default);
            return ctx.sendMessage({ content: null, embeds: [embed] });
        }

        if (isNaN(args[0]) && ctx.isInteraction) args[0] = ctx.interaction.options.data[0].options[0].value;
        else if (isNaN(args[0])) return ctx.sendMessage('Amount must be a real number.');
        if (args[0] < 0.1 || args[0] > 20000) return ctx.sendMessage('Amount must be between 0.1 and 20000.');

        player.filter.setTremolo(player.filter.tremolo.depth, args[0]);


        const embed = new MessageEmbed()
            .setAuthor(`Frequency set to ${args[0]}Hz`, ctx.author.displayAvatarURL())
            .setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};