const { Source } = require('yasha');
const { TrackPlaylist, Track } = require('yasha/src/Track');
const { MessageEmbed } = require('discord.js');
const QueueHelper = require('../../helpers/QueueHelper');

const Command = require('../../structures/Command');

module.exports = class Search extends Command {
    constructor(client) {
        super(client, {
            name: 'search',
            description: {
                content: 'Provides a variety of search results for a song.',
                usage: '[source (yt, sc, or sp)] <search query>',
                examples: [
                    'resonance',
                    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'https://open.spotify.com/track/5hVghJ4KaYES3BFUATCYn0?si=44452e03da534c75',
                    'sc resonance',
                ],
            },
            args: true,
            voiceRequirements: {
                isInVoiceChannel: true,
            },
            options: [
                {
                    name: 'query',
                    type: 3,
                    required: true,
                    description: 'The query to search for.',
                },
            ],
            permissions: {
                botPermissions: ['CONNECT', 'SPEAK'],
            },
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Searching for \`${args.join(' ')}\`...`);

        let query = args.slice(0).join(' ');
        let source;

        if (args[0].toLowerCase() === 'soundcloud' || args[0].toLowerCase() === 'sc') {
            query = args.slice(1).join(' ');
            source = 'soundcloud';
        }
        else if (args[0].toLowerCase() === 'spotify' || args[0].toLowerCase() === 'sp') {
            query = args.slice(1).join(' ');
            source = 'spotify';
        }
        else if (args[0].toLowerCase() === 'youtube' || args[0].toLowerCase() === 'yt') {
            query = args.slice(1).join(' ');
            source = 'youtube';
        }

        let player = client.music.players.get(ctx.guild.id);
        if (!player) {
            player = await client.music.newPlayer(ctx.guild, ctx.member.voice.channel, ctx.channel);
            player.connect();
        }

        let results;
        try {
            switch (source) {
                case 'soundcloud':
                    results = await Source.Soundcloud.search(query);
                    break;
                case 'spotify':
                    results = await Source.resolve(query);
                    break;
                case 'youtube':
                    results = await Source.Youtube.search(query);
                    break;
                default:
                    results = await Source.resolve(query);
                    break;
            }

            if (!results) results = await Source.Youtube.search(query);

            if (!results) return ctx.editMessage('No results found.');

            if (results instanceof Track) {
                const track = results;
                track.requester = ctx.author;
                track.icon = QueueHelper.reduceThumbnails(track.icons);
                track.thumbnail = QueueHelper.reduceThumbnails(track.thumbnails);

                player.queue.add(track);
                if (!player.playing && !player.paused) player.play();
                return ctx.editMessage({ content: null, embeds: [QueueHelper.queuedEmbed(track.title, track.url, track.duration, null, ctx.author, client.config.colors.default)] });
            }

            if (results instanceof TrackPlaylist) {
                results.forEach(t => {
                    t.requester = ctx.author;
                    t.icon = QueueHelper.reduceThumbnails(t.icons);
                    t.thumbnail = QueueHelper.reduceThumbnails(t.thumbnails);
                });

                let res = results;
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
                        player.queue.add(track);
                    }
                }

                const totalDuration = list.reduce((acc, cur) => acc + cur.duration, 0);

                if (!player.playing && !player.paused) player.play();
                return ctx.editMessage({ content: null, embeds: [QueueHelper.queuedEmbed(results.title, results.url, totalDuration, list.length, ctx.author, client.config.colors.default)] });
            }

            let n = 0;
            const tracks = results.slice(0, 10);

            const str = tracks
                .slice(0, 10)
                .map(result => `**${++n}.** [${result.title}](${result.url})`)
                .join('\n');

            const embed = new MessageEmbed()
                .setAuthor('Song Selection.', ctx.author.displayAvatarURL())
                .setDescription(str)
                .setFooter('Your response time closes within the next 30 seconds. Type "cancel" to cancel the selection, type "queueall" to queue all songs.')
                .setColor(client.config.colors.default);
            await ctx.editMessage({ content: null, embeds: [embed] });

            const filter = m =>
                (ctx.author.id === m.author.id) &&
                ((parseInt(m.content) >= 1 && parseInt(m.content) <= tracks.length) || m.content.toLowerCase() === 'queueall' || m.content.toLowerCase() === 'cancel');

            try {
                const response = await ctx.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
                const entry = response.first().content.toLowerCase();
                if (entry === 'queueall') {
                    for (const track of tracks) {
                        player.queue.add(track);
                        track.requester = ctx.author;
                        track.icon = QueueHelper.reduceThumbnails(track.icons);
                        track.thumbnail = QueueHelper.reduceThumbnails(track.thumbnails);
                    }
                    ctx.editMessage({
                        content: null, embeds: [QueueHelper.queuedEmbed(
                            null,
                            null,
                            null,
                            tracks.length,
                            tracks[0].requester,
                            client.config.colors.default,
                        )],
                    });
                }
                else if (entry === 'cancel') {
                    return ctx.sendFollowUp('Cancelled selection');
                }
                else {
                    const track = tracks[entry - 1];
                    track.requester = ctx.author;
                    track.icon = QueueHelper.reduceThumbnails(track.icons);
                    track.thumbnail = QueueHelper.reduceThumbnails(track.thumbnails);

                    player.queue.add(track);
                    ctx.editMessage({
                        content: ' ', embeds: [QueueHelper.queuedEmbed(
                            track.title,
                            track.uri,
                            track.duration,
                            null,
                            track.requester,
                            client.config.colors.default,
                        )],
                    });
                }
                if (!player.playing && !player.paused) player.play();
            }
            catch (err) {
                ctx.sendFollowUp('Cancelled selection.');
            }
        }
        catch (err) {
            client.logger.error(err);
            return ctx.editMessage('No results found.');
        }
    }
};
