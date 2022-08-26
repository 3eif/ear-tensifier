const { ApplicationCommandOptionType } = require('discord-api-types');
const { EmbedBuilder } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Earrape extends Command {
    constructor(client) {
        super(client, {
            name: 'earrape',
            description: {
                content: 'Turns the earrape filter on or off.',
            },
            aliases: ['veryloud', 'hell', 'loud'],
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'on',
                    description: 'Turns on the earrape filter.',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'off',
                    description: 'Turns off the earrape filter.',
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        if (ctx.guild.id == '441290611904086016') return;

        const player = client.music.players.get(ctx.guild.id);
        const embed = new EmbedBuilder();

        if ((ctx.isInteraction && ctx.interaction.options.data[0].name == 'off') || (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off'))) {
            player.filter.setEarrape(false);
            embed.setAuthor('Turned off earrape', ctx.author.displayAvatarURL());
        }
        else {
            player.filter.setEarrape(true);
            embed.setAuthor('Turned on earrape', ctx.author.displayAvatarURL());
            embed.setFooter(`You can turn this filter off by using the '${await ctx.messageHelper.getPrefix()}earrape off' command.`);
        }
        embed.setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};
