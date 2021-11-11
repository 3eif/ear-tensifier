const Command = require('../../structures/Command');

module.exports = class Loop extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            description: 'Repeats the current queue/song.',
            aliases: ['repeat', 'unloop'],
            usage: '<queue/song>',
            cooldown: '4',
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'songORqueue',
                    type: 3,
                    required: false,
                    description: 'Whether to loop the queue or current song.',
                },
            ],
            slashCommand: true,
        });
    }

    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);

        if (!args[0] || args[0].toLowerCase() == 'song') {
            if (!player.trackRepeat) {
                player.setTrackRepeat(true);
                return ctx.sendMessage('Song is now being looped');
            }
            else {
                player.setTrackRepeat(false);
                return ctx.sendMessage('Song has been unlooped');
            }
        }
        else if (args[0] == 'queue') {
            if (player.queueRepeat) {
                player.setQueueRepeat(false);
                return ctx.sendMessage('Queue has been unlooped.');
            }
            else {
                player.setQueueRepeat(true);
                return ctx.sendMessage('Queue is being looped.');
            }
        }
    }
};