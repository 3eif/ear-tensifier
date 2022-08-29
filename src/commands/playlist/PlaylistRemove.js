const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const Command = require('../../structures/Command');
const Playlist = require('../../models/Playlist');

module.exports = class PlaylistRemove extends Command {
    constructor(client) {
        super(client, {
            name: 'playlistremove',
            description: {
                content: 'Removes a song from one of your playlists.',
                usage: '<playlist name> <song position>',
                examples: ['DOSTM 3'],
            },
            aliases: ['premove'],
            args: true,
            acceptsAttachemnts: true,
            options: [
                {
                    name: 'playlist',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The playlist\'s name.',
                    autocomplete: true,
                },
                {
                    name: 'position',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    description: 'The song to add.',
                },
            ],
            slashCommand: true,
        });
    }

    async run(client, ctx, args) {
        if (!args[1] || isNaN(args[1])) return ctx.sendMessage(`Please specify the position of the song you want to remove.\nUsage: \`${await ctx.messageHelper.getPrefix()} premove <playlist name> <song position>\``);

        const playlistName = args[0].replace(/_/g, ' ');

        Playlist.findOne({
            name: playlistName,
            creator: ctx.author.id,
        }, async (err, playlist) => {
            if (err) client.logger.error(err);

            if (!playlist) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: playlistName, iconURL: ctx.author.displayAvatarURL() })
                    .setDescription(`${client.config.emojis.failure} Could not find a playlist by the name ${playlistName}.\nFor a list of your playlists type \`ear playlists\``)
                    .setTimestamp()
                    .setColor(client.config.colors.default);
                return ctx.sendMessage({ content: null, embeds: [embed] });
            }
            else {
                if (playlist.tracks.length < args[1]) return ctx.sendMessage('That song doesn\'t exist in the playlist.');
                const songName = playlist.tracks[args[1] - 1].title;
                playlist.tracks.splice(args[1] - 1, 1);
                await playlist.updateOne({ tracks: playlist.tracks }).catch(e => client.logger.error(e));

                const embed = new EmbedBuilder()
                    .setAuthor({ name: playlist.name, iconURL: ctx.author.displayAvatarURL() })
                    .setDescription(`${client.config.emojis.success} Removed **${songName}** from **${playlist.name}**.`)
                    .setFooter({ text: `ID: ${playlist._id}` })
                    .setColor(client.config.colors.default)
                    .setTimestamp();
                return ctx.sendMessage({ content: null, embeds: [embed] });
            }
        });
    }
};
