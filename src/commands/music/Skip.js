const Command = require('../../structures/Command');

module.exports = class Skip extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            description: {
                content: 'Skips the current song.',
            },
            aliases: ['s', 'next'],
            args: false,
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            slashCommand: true,
        });
    }

    async run(client, ctx) {
        const player = client.music.players.get(ctx.guild.id);

        if (player.trackRepeat) player.setTrackRepeat(false);
        if (player.queueRepeat) player.setQueueRepeat(false);
        if (player) player.skip();

        return ctx.sendMessage('Skipped...');
    }
};
