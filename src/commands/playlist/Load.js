const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');
const Playlist = require('../../models/Playlist');
const PlaylistTrack = require('../../structures/PlaylistTrack');
const FileTrack = require('../../structures/FileTrack');

module.exports = class Load extends Command {
    constructor(client) {
        super(client, {
            name: 'load',
            description: {
                content: 'Loads a playlist into your queue.',
                usage: '<playlist name>',
                examples: ['DSOTM'],
            },
            args: true,
            voiceRequirements: {
                isInVoiceChannel: true,
            },
            options: [
                {
                    name: 'playlist',
                    type: 3,
                    required: true,
                    description: 'The playlist\'s name.',
                },
            ],
            slashCommand: true,
        });
    }

    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Queueing playlist (This might take a few seconds.)...`);

        let player = client.music.players.get(ctx.guild.id);
        if (!player) {
            player = await client.music.newPlayer(ctx.guild, ctx.member.voice.channel, ctx.channel);
            player.connect();
        }

        if (player.queue.length > client.config.max.songsInQueue) return ctx.editMessage(`You have reached the **maximum** amount of songs (${client.config.max.songsInQueue})`);

        const playlistName = args.join(' ').replace(/_/g, ' ');

        Playlist.findOne({
            name: playlistName,
            creator: ctx.author.id,
        }, async (err, playlist) => {
            if (err) client.logger.error(err);

            if (!playlist) {
                const embed = new MessageEmbed()
                    .setAuthor(playlistName, ctx.author.displayAvatarURL())
                    .setDescription(`${client.config.emojis.failure} Could not find a playlist by the name ${playlistName}.`)
                    .setTimestamp()
                    .setColor(client.config.colors.default);
                await ctx.editMessage({ content: null, embeds: [embed] });
            }
            else {
                const tracksToAdd = playlist.tracks.map(track => {
                    return track.platform == 'file' ? new FileTrack({
                        url: track.url,
                        author: 'Unknown Author',
                        title: 'Unknown Title',
                        platform: track.platform,
                        requester: ctx.author,
                        duration: FileTrack.getDuration(track.url),
                    }) : new PlaylistTrack({
                        id: track.id,
                        title: track.title,
                        url: track.url,
                        duration: track.duration,
                        thumbnail: track.thumbnail,
                        author: track.author,
                        platform: track.platform,
                        requester: ctx.author,
                    });
                });

                let tracksQueued = 0;
                const queueAllSongs = new Promise((resolve) => {
                    for (let i = 0; i < tracksToAdd.length; i++) {
                        player.queue.add(tracksToAdd[i]);
                        tracksQueued++;
                        if (!player.playing && !player.paused && !player.queue.length) player.play();
                        if (i == tracksToAdd.length - 1 || player.queue.length >= client.config.max.songsInQueue) resolve();
                    }
                });

                queueAllSongs.then(async () => {
                    const embed = new MessageEmbed()
                        .setDescription(`Queued **${tracksQueued} songs** from **${playlistName}**.`)
                        .setColor(client.config.colors.default)
                        .setTimestamp();
                    await ctx.editMessage({ content: null, embeds: [embed] });
                });
            }
        });
    }
};