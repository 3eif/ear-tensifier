const Command = require('../../structures/Command');

module.exports = class Replay extends Command {
    constructor(client) {
        super(client, {
            name: 'replay',
            description: {
                content: 'Starts the song from the beginning.',
            },
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

        player.seek(0);
        return ctx.sendMessage('Replayed song...');
    }
};