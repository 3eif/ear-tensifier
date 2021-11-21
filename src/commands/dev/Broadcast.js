const Command = require('../../structures/Command');

module.exports = class Broadcast extends Command {
    constructor(client) {
        super(client, {
            name: 'broadcast',
            description: {
                content: 'Sends a message to all players in all clusters.',
            },
            permissions: {
                dev: true,
            },
        });
    }
    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Broadcasting message...`);

        const message = args.join(' ');
        const players = await client.shard.broadcastEval(`this.music.players.each(p => p.textChannel.send('${message}'))`);

        ctx.editMessage(`${client.config.emojis.success} Successfully broadcasted message to ${players.size} channels.`);
    }
};
