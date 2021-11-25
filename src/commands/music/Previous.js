const Command = require('../../structures/Command');

module.exports = class Previous extends Command {
    constructor(client) {
        super(client, {
            name: 'previous',
            description: {
                content: 'Plays the previous song.',
            },
            aliases: ['back'],
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
        if (player.queue.previous.length == 0) return ctx.sendMessage('There is no previous song.');
        player.queue.unshift(player.queue.previous.pop());
        player.skip();
    }
};
