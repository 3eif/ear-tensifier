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
        







        const message = 'hello earthlings';

        await client.shard.broadcastEval(broadcastMessage, { context: { message: message } });

        // await ctx.sendDeferMessage(`${client.config.emojis.typing} Broadcasting message...`);

        // const arg = args.join(' ');
        // await client.shard.broadcastEval(broadcastMessage, { context: { message: arg } });

        function broadcastMessage(c, { message }) {
            // c.music.getPlayingPlayers().each(p => p.textChannel.send(message));
            console.log(c.shard);
        }

        // const players = await client.shard.broadcastEval(c => c.music.getPlayingPlayers().size);
        // let totalPlayers = 0;
        // for (const player of players) {
        //     totalPlayers += player;
        // }
        // ctx.editMessage(`${client.config.emojis.success} Successfully broadcasted message to ${totalPlayers} servers.`);
    }
};