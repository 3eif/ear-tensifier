const Command = require('../../structures/Command');

module.exports = class Pause extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            description: {
                content: 'Pauses the current song.',
            },
            aliases: ['stop'],
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

        player.pause(player.playing);
        return ctx.sendMessage(`Song is now **${player.playing ? 'resumed' : 'paused'}.**`);
    }
};
