const { MessageEmbed } = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types');

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
                },
                {
                    name: 'new',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The playlist\'s new name.',
                },
            ],
        });
    }
    async run(client, ctx, args) {
        if (!args[1]) {
            return ctx.sendMessage(`Please provide a new name for the playlist.\nUsage: \`${await ctx.messageHelper.getPrefix()}rename <current playlist name> <new playlist name>\``);
        }

        if (args[0].length > 32 || args[1].length > 32) return ctx.sendMessage('Playlist title must be less than 32 characters!');
        const playlistName = args[0].replace(/_/g, ' ');
        const newPlaylistName = args[1].replace(/_/g, ' ');

        Playlist.findOne({
            name: playlistName,
            creator: ctx.author.id,
        }, async (err, p) => {
            if (err) client.log(err);
            if (!p) {
                const embed = new MessageEmbed()
                    .setAuthor(playlistName, ctx.author.displayAvatarURL())
                    .setDescription(`${client.config.emojis.failure} Could not find a playlist by the name ${playlistName}.\nFor a list of your playlists type \`ear playlists\``)
                    .setTimestamp()
                    .setColor(client.config.colors.default);
                return ctx.sendMessage({ content: null, embeds: [embed] });
            }
            else {
                p.name = newPlaylistName;
                p.save();

                const embed = new MessageEmbed()
                    .setAuthor(p.name, ctx.author.displayAvatarURL())
                    .setDescription(`${client.config.emojis.success} Successfully renamed \`${playlistName}\` to \`${newPlaylistName}\`.`)
                    .setFooter(`ID: ${p._id}`)
                    .setColor(client.config.colors.default)
                    .setTimestamp();
                return ctx.sendMessage({ content: null, embeds: [embed] });
            }
        });
    }
};
