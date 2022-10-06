const { Track: { TrackPlaylist } } = require('yasha');
const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

const Command = require('../../structures/Command');
const QueueHelper = require('../../helpers/QueueHelper');

module.exports = class Spotify extends Command {
    constructor(client) {
        super(client, {
            name: 'spotify',
            description: {
                content: 'Plays a song or playlist from spotify.',
                usage: '<search query>',
                examples: [
                    'Time',
                    'https://open.spotify.com/album/5uRdvUR7xCnHmUW8n64n9y?si=-x7dShkeTS-aqFvlDCG8GA',
                    'https://open.spotify.com/playlist/4ESFBGQQZEM426tyQo61Nt?si=8d376ef5dc2e403a',
                ],
            },
            aliases: ['sp'],
            args: true,
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
                botPermissions: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],
            },
            slashCommand: false,
            enabled: false,
        });
    }

    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Searching for \`${args.join(' ')}\`...`);

        const query = args.slice(0).join(' ');
        const source = 'spotify';

        let player = client.music.players.get(ctx.guild.id);
        if (!player) {
            if (!ctx.member.voice.channel.joinable) return ctx.editMessage(`I could not join <#${ctx.member.voice.channel.id}> since it was full or I have insufficient permissions to join it.`);
            player = await client.music.newPlayer(ctx.guild, ctx.member.voice.channel, ctx.channel);
            player.connect();
        }

        if (player.queue.length > client.config.max.songsInQueue) return ctx.editMessage(`You have reached the **maximum** amount of songs (${client.config.max.songsInQueue})`);

        let result;
        try {
            result = await client.music.search(query, ctx.author, source);
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
                    player.queue.add(track);
                }
            }

            const totalDuration = list.reduce((acc, cur) => acc + cur.duration, 0);

            if (!player.playing && !player.paused) player.play();
            return ctx.editMessage({ content: null, embeds: [QueueHelper.queuedEmbed(result.title, result.url, totalDuration, list.length, ctx.author, client.config.colors.default)] });
        }

        player.queue.add(result);
        if (!player.playing && !player.paused) player.play();

        ctx.editMessage({ content: null, embeds: [QueueHelper.queuedEmbed(result.title, result.url, result.duration, null, ctx.author, client.config.colors.default)] });
    }
};
