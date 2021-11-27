const { MessageEmbed } = require('discord.js');

const Filter = require('../../structures/Filter');
const Command = require('../../structures/Command');

module.exports = class Earrape extends Command {
    constructor(client) {
        super(client, {
            name: 'earrape',
            description: {
                content: 'Turns the earrape filter on or off.',
            },
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'on',
                    description: 'Turns on the earrape filter.',
                    type: 1,
                },
                {
                    name: 'off',
                    description: 'Turns off the earrape filter.',
                    type: 1,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);
        const embed = new MessageEmbed();

        if ((ctx.isInteraction && ctx.interaction.options.data[0].name == 'off') || (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off'))) {
            player.resetFilter();
            embed.setAuthor('Turned off earrape', ctx.author.displayAvatarURL());
        }
        else {
            player.setFilter(new Filter.Earrape(player));
            embed.setAuthor('Turned on earrape', ctx.author.displayAvatarURL());
            embed.setFooter(`You can turn this filter off by using the '${await ctx.messageHelper.getPrefix()}earrape off' command.`);
        }
        embed.setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};
