const { Track: { TrackPlaylist } } = require('yasha');

const Command = require('../../structures/Command');
const QueueHelper = require('../../helpers/QueueHelper');

module.exports = class TestPlay extends Command {
    constructor(client) {
        super(client, {
            name: 'testplay',
            description: {
                content: 'Plays a song or playlist (defaults to YouTube).',
                usage: '<search query>',
                examples: [
                    'resonance',
                    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'https://open.spotify.com/track/5hVghJ4KaYES3BFUATCYn0?si=44452e03da534c75',
                    'sc resonance',
                ],
            },
            aliases: ['p', 'tocar'],
            args: true,
            acceptsAttachments: false,
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
        const query = args.slice(0).join(' ');
        let result;
        try {
            let player = client.music.players.get(ctx.guild.id);
		    if (!player) {
			player = await client.music.newPlayer(ctx.guild, ctx.member.voice.channel, ctx.channel);
			player.connect();
		    }
            result = await client.music.search(query, ctx.author);
            player.queue.add(result);
		    if (!player.playing && !player.paused) player.play();
            }
        catch (error) {
            return client.logger.error(error);
        }
    }
};
