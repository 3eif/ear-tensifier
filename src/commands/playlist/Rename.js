const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const Command = require('../../structures/Command');
const Playlist = require('../../models/Playlist');

module.exports = class Rename extends Command {
    constructor(client) {
        super(client, {
            name: 'rename',
            description: {
                content: 'Renames a playlist',
                usage: '<current playlist name> <new playlist name>',
                examples: ['MyPlaylist MyEpicPlaylist'],
            },
            args: true,
            aliases: ['prename'],
            options: [
                {
                    name: 'current',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The playlist\'s current name.',
                    max_length: 100,
                    autocomplete: true,
                },
                {
                    name: 'new',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The playlist\'s new name.',
                    max_length: 100,
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        if (!args[1]) {
            return ctx.sendMessage(`Please provide a new name for the playlist.\nUsage: \`${await ctx.messageHelper.getPrefix()}rename <current playlist name> <new playlist name>\``);
        }

        if (args[0].length > this.options[0].max_length || args[1].length > this.options[1].max_length) return ctx.sendMessage(`Playlist title must be less than ${this.options[0].max_value} characters!`);
        const playlistName = args[0].replace(/_/g, ' ');
        const newPlaylistName = args[1].replace(/_/g, ' ');

        Playlist.findOne({
            name: playlistName,
            creator: ctx.author.id,
        }, async (err, p) => {
            if (err) client.log(err);
            if (!p) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: playlistName, iconURL: ctx.author.displayAvatarURL() })
                    .setDescription(`${client.config.emojis.failure} Could not find a playlist by the name ${playlistName}.\nFor a list of your playlists type \`ear playlists\``)
                    .setTimestamp()
                    .setColor(client.config.colors.default);
                return ctx.sendMessage({ content: null, embeds: [embed] });
            }
            else {
                p.name = newPlaylistName;
                p.save();

                const embed = new EmbedBuilder()
                    .setAuthor({ name: p.name, iconURL: ctx.author.displayAvatarURL() })
                    .setDescription(`${client.config.emojis.success} Successfully renamed \`${playlistName}\` to \`${newPlaylistName}\`.`)
                    .setFooter({ text: `ID: ${p._id}` })
                    .setColor(client.config.colors.default)
                    .setTimestamp();
                return ctx.sendMessage({ content: null, embeds: [embed] });
            }
        });
    }
};
