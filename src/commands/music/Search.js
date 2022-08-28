const { Source } = require('yasha');
const { TrackPlaylist, Track } = require('yasha/src/Track');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType, ButtonStyle } = require('discord-api-types');
const { ButtonBuilder, SelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders');

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
            acceptsAttachments: false,
            voiceRequirements: {
                isInVoiceChannel: true,
            },
            options: [
                {
                    name: 'query',
                    type: ApplicationCommandOptionType.String,
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
        let query;
        let source;
        if (args[0]) {
            const platform = args[0].toLowerCase();
            query = args.slice(1).join(' ');
            switch (platform) {
                case 'yt' || 'youtube':
                    source = 'youtube';
                    break;
                case 'sc' || 'soundcloud':
                    source = 'soundcloud';
                    break;
                case 'sp' || 'spotify':
                    source = 'spotify';
                    break;
                case 'apple' || 'applemusic':
                    source = 'apple';
                    break;
                default:
                    query = args.slice(0).join(' ');
                    break;
            }
        }
        else {
            query = ctx.attachments.first().url;
            source = 'file';
        }

        await ctx.sendDeferMessage(`${client.config.emojis.typing} Searching for \`${query}\`...`);

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
                    results = await Source.Spotify.search(query);
                    break;
                case 'youtube':
                    results = await Source.Youtube.search(query);
                    break;
                case 'apple':
                    results = await Source.AppleMusic.search(query);
                    break;
                default:
                    results = await Source.resolve(query);
                    break;
            }

            if (!results) {
                results = await Source.Youtube.search(query);
                source = 'youtube';
            }

            if (!results) return ctx.editMessage('No results found.');

            if (results instanceof Track) {
                const track = results;
                track.requester = ctx.author;
                if (results instanceof Track) {
                    track.icon = QueueHelper.reduceThumbnails(track.icons);
                    track.thumbnail = QueueHelper.reduceThumbnails(track.thumbnails);
                }
                else track.platform = 'file';

                player.queue.add(track);
                if (!player.playing && !player.paused) player.play();
                return ctx.editMessage({ content: null, embeds: [QueueHelper.queuedEmbed(track.title, track.url, player.getDuration(), null, ctx.author, client.config.colors.default)] });
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
                .map(r => `**${++n}.** [${r.title}](${r.url})`)
                .join('\n');

            const selectMenuArray = [];
            for (let i = 0; i < tracks.length; i++) {
                const track = tracks[i];
                let label = `${i + 1}. ${track.title}`;
                if (label.length > 100) label = label.substring(0, 97) + '...';
                selectMenuArray.push({
                    label: label,
                    description: track.author,
                    value: i.toString(),
                });
            }

            let hasReceivedIndexes = false;

            const selectMenuRow = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId(`${ctx.id}:SELECT_MENU`)
                        .setPlaceholder('Nothing selected')
                        .setMinValues(1)
                        .setMaxValues(10)
                        .addOptions(selectMenuArray),
                );

            const buttonRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${ctx.id}:BUTTON`)
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('Cancel')
                        .setEmoji('🗑️'),
                );

            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Song Selection.', iconURL: ctx.author.displayAvatarURL() })
                .setDescription(str)
                .setFooter({ name: 'Your have 30 seconds to make your selection via the dropdown menu.' })
                .setColor(client.config.colors.default);
            const message = await ctx.editMessage({ content: null, embeds: [embed], components: [selectMenuRow, buttonRow] });

            const buttonCollector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000 });
            buttonCollector.on('collect', interaction => {
                if (interaction.user.id === ctx.author.id) {
                    if (interaction.customId == `${ctx.id}:BUTTON`) {
                        hasReceivedIndexes = true;
                        return interaction.message.delete();
                    }
                }
            });

            const selectMenuCollector = message.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 30000 });
            selectMenuCollector.on('collect', async interaction => {
                if (interaction.customId != `${ctx.id}:SELECT_MENU`) return;
                if (interaction.user.id != ctx.author.id) return;

                const selected = interaction.values.map(s => parseInt(s));
                const tracksToAdd = selected.map(s => results[s]);
                hasReceivedIndexes = true;

                if (tracksToAdd.length) {
                    if (tracksToAdd.length > 1) {
                        for (const track of tracksToAdd) {
                            player.queue.add(track);
                            track.requester = ctx.author;
                            track.icon = QueueHelper.reduceThumbnails(track.icons);
                            track.thumbnail = QueueHelper.reduceThumbnails(track.thumbnails);
                        }
                        ctx.sendFollowUp({
                            content: null, embeds: [QueueHelper.queuedEmbed(
                                `${tracksToAdd.length} Tracks`,
                                null,
                                null,
                                null,
                                tracksToAdd[0].requester,
                                client.config.colors.default,
                            )],
                        });

                        if (!player.playing && !player.paused) player.play();
                    }
                    else {
                        const track = tracksToAdd[0];
                        track.requester = ctx.author;
                        track.icon = QueueHelper.reduceThumbnails(track.icons);
                        track.thumbnail = QueueHelper.reduceThumbnails(track.thumbnails);

                        player.queue.add(track);
                        if (!player.playing && !player.paused) player.play();

                        ctx.sendFollowUp({
                            content: ' ', embeds: [QueueHelper.queuedEmbed(
                                track.title,
                                track.uri,
                                player.getDuration() ? player.getDuration() : track.duration,
                                null,
                                track.requester,
                                client.config.colors.default,
                            )],
                        });
                    }
                }

                await interaction.update({ components: [] });
            });

            buttonCollector.on('end', async () => {
                if (!hasReceivedIndexes) return ctx.sendFollowUp('Selection expired.');
            });
        }
        catch (err) {
            client.logger.error(err);
            return ctx.editMessage('No results found.');
        }
    }
};
