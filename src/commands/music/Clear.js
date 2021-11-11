const Command = require('../../structures/Command');

module.exports = class Clear extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            description: {
                content: 'Clears all the songs in the queue.',
            },
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
        player.queue.clear();

        return ctx.sendMessage('Cleared the queue.');
    }
};
