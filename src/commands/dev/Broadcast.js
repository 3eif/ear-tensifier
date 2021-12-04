const Command = require('../../structures/Command');

module.exports = class Broadcast extends Command {
    constructor(client) {
        super(client, {
            name: 'broadcast',
            description: {
                content: 'Sends a message to all players in all shards.',
            },
            permissions: {
                dev: true,
            },
        });
    }
    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Broadcasting message...`);

        const arg = args.join(' ');
        await client.shard.broadcastEval(broadcastMessage, { context: { message: arg } });

        function broadcastMessage(c, { message }) {
            c.music.players.each(p => p.textChannel.send(message));
        }

        ctx.editMessage(`${client.config.emojis.success} Successfully broadcasted message to ${client.music.players.size} servers.`);
    }
};
