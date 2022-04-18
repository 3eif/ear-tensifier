const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Nightcore extends Command {
    constructor(client) {
        super(client, {
            name: 'nightcore',
            description: {
                content: 'Turns the nightcore filter on or off.',
            },
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'on',
                    description: 'Turns on the nightcore filter.',
                    type: 1,
                },
                {
                    name: 'off',
                    description: 'Turns off the nightcore filter.',
                    type: 1,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        if (ctx.guild.id == '441290611904086016') return;

        const player = client.music.players.get(ctx.guild.id);
        const embed = new MessageEmbed();

        if ((ctx.isInteraction && ctx.interaction.options.data[0].name == 'off') || (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off'))) {
            player.filter.setNightcore(false);
            embed.setAuthor('Turned off nightcore', ctx.author.displayAvatarURL());
        }
        else {
            player.filter.setNightcore(true);
            embed.setAuthor('Turned on nightcore', ctx.author.displayAvatarURL());
        }
        embed.setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};
