const Command = require('../../structures/Command');

module.exports = class Shutdown extends Command {
    constructor(client) {
        super(client, {
            name: 'shutdown',
            description: {
                content: 'Shuts down the bot.',
                usage: '<shard or "all">',
                examples: ['1', 'all'],
            },
            permissions: {
                dev: true,
            },
        });
    }
    async run(client, ctx, args) {
        if (!args[0] || args[0] == 'all') {
            await ctx.sendMessage('Shutting down all clusters...');
            client.shard.send({ type: 'shutdown', cluster: 'all' });
        }
        else if (!isNaN(args[0])) {
            await ctx.sendMessage(`Shutting down cluster ${args[0]}...`);
            client.shard.send({ type: 'shutdown', cluster: Number(args[0]) });
        }
        else {
            await ctx.sendMessage('Invalid argument. Please specify a cluster or "all"');
        }
        // try {
        //     client.shard.broadcastEval(process.exit(1));
        // }
        // catch (e) {
        //     client.logger.error(e);
        // }
    }
};