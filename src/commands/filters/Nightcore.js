const { ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

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
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'off',
                    description: 'Turns off the nightcore filter.',
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
            player.filter.setNightcore(false);
            embed.setAuthor({ name: 'Turned off nightcore', iconURL: ctx.author.displayAvatarURL() });
        }
        else {
            player.filter.setNightcore(true);
            embed.setAuthor({ name: 'Turned on nightcore', iconURL: ctx.author.displayAvatarURL() });
        }
        embed.setColor(client.config.colors.default);
        return ctx.sendMessage({ content: null, embeds: [embed] });
    }
};
