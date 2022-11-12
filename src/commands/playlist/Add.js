const { Track: { TrackPlaylist } } = require('yasha');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const Command = require('../../structures/Command');
const Playlist = require('../../models/Playlist');
const formatDuration = require('../../utils/formatDuration');

module.exports = class Create extends Command {
    constructor(client) {
        super(client, {
            name: 'add',
            description: {
                content: 'Adds a song to one of your playlists.',
                usage: '<playlist name> <search query/link>',
                examples: ['DSOTM https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv?si=ACDwAO26S5iFYzrvaJqVsg'],
            },
            args: true,
            acceptsAttachemnts: true,
            options: [
                {
                    name: 'playlist',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The playlist\'s name.',
                    max_length: 100,
                    autocomplete: true,
                },
                {
                    name: 'query',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The song to add.',
                },
            ],
            slashCommand: false,
            enabled: false,
        });
    }

    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Adding song(s) to your playlist (This might take a few seconds.)...`);

        if (!args[1] && !ctx.attachments) return ctx.editMessage('Please specify a search query or link.\nUsage: `/create <playlist name> <search query/link>`');
        if (args[0].length > this.options[0].max_length) return ctx.editMessage(`Playlist name must be less than ${this.options[0].max_length} characters!`);

        const tracksToAdd = [];
        let playlistMessage = '';
        const playlistName = args[0].replace(/_/g, ' ');
        const query = args.splice(1).join(' ');

        let result;
        try {
            result = await client.music.search(query, ctx.author);
        }
        catch (error) {
            return ctx.editMessage('No results found.');
        }

        if (result instanceof TrackPlaylist) {
            let res = result;
            const firstTrack = res.first_track;
            let list = [];

            if (firstTrack) list.push(firstTrack);

            while (res && res.length) {
                if (firstTrack) {
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].equals(firstTrack)) {
                            res.splice(i, 1);
                            break;
                        }
                    }
                }
                list = list.concat(res);
                try {
                    res = await res.next();
                }
                catch (e) {
                    client.logger.error(e);
                    throw e;
                }
            }

            if (list.length) {
                for (const track of list) {
                    if (!track.requester) track.requester = ctx.author;
                    tracksToAdd.push(track);
                }
            }

            const totalDuration = list.reduce((acc, cur) => acc + cur.duration, 0);
            playlistMessage = `Added **[${result.title}](${result.url})** [${formatDuration(totalDuration)}] (${list.length} track) to **${playlistName}**`;
        }
        else {
            tracksToAdd.push(result);
            playlistMessage = `Added **[${result.title}](${result.url})** [${formatDuration(result.duration)}] to **${playlistName}**`;
        }

        if (!tracksToAdd.length) return;

        for (let i = 0; i < tracksToAdd.length; i++) {
            tracksToAdd[i] = {
                _id: tracksToAdd[i].id ? tracksToAdd[i].id : tracksToAdd[i].url,
                title: tracksToAdd[i].title ? tracksToAdd[i].title : 'Unknown Title',
                url: tracksToAdd[i].url,
                author: tracksToAdd[i].author ? tracksToAdd[i].author : 'Unknown Author',
                duration: tracksToAdd[i].duration,
                thumbnail: tracksToAdd[i].thumbnail,
                platform: tracksToAdd[i].platform ? tracksToAdd[i].platform : 'file',
                playable: tracksToAdd[i].playable,
            };
        }

        Playlist.findOne({
            name: playlistName,
            creator: ctx.author.id,
        }, async (err, playlist) => {
            if (err) client.logger.error(err);

            if (!playlist) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: playlistName, iconURL: ctx.author.displayAvatarURL() })
                    .setDescription(`${client.config.emojis.failure} Could not find a playlist by the name ${playlistName}.\nFor a list of your playlists type \`/playlists\``)
                    .setTimestamp()
                    .setColor(client.config.colors.default);
                return ctx.editMessage({ content: null, embeds: [embed] });
            }
            else {
                if (playlist.tracks.length >= client.config.max.songsInPlaylist) return ctx.editMessage(`${client.config.emojis.failure} You have reached the **maximum** amount of songs in the playlist.`);

                const currentPlaylistTracks = playlist.tracks;
                playlist.tracks = currentPlaylistTracks.concat(tracksToAdd);
                playlist.tracks.length = clamp(playlist.tracks.length, 0, client.config.max.songsInPlaylist);
                await playlist.updateOne({ tracks: playlist.tracks }).catch(e => client.logger.error(e));

                const embed = new EmbedBuilder()
                    .setAuthor({ name: playlist.name, iconURL: ctx.author.displayAvatarURL() })
                    .setDescription(`${client.config.emojis.success} Found an existing playlist with the name: **${playlist.name}**.\n${playlistMessage}`)
                    .setFooter({ text: `ID: ${playlist._id} • ${playlist.tracks.length}/${client.config.max.songsInPlaylist}` })
                    .setColor(client.config.colors.default)
                    .setTimestamp();
                return ctx.editMessage({ content: null, embeds: [embed] });
            }
        });
    }
};

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}