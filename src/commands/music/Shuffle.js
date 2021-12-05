const Command = require('../../structures/Command');

module.exports = class Shuffle extends Command {
    constructor(client) {
        super(client, {
            name: 'shuffle',
            description: {
                content: 'Shuffles the queue.',
            },
            aliases: ['mix'],
            voiceRequirements: {
                inVoiceChannel: true,
                sameVoiceChannel: true,
                playing: true,
            },
            slashCommand: true,
        });
    }
    async run(client, ctx) {
        const player = client.music.players.get(ctx.guild.id);

        player.queue.shuffle();
        return ctx.sendMessage('Shuffled the queue...');
    }
};