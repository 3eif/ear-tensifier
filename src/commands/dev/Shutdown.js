const Command = require('../../structures/Command');

module.exports = class Shutdown extends Command {
    constructor(client) {
        super(client, {
            name: 'shutdown',
            description: {
                content: 'Shuts down the bot or a specific shard if given.',
                usage: '<shard or "all">',
                examples: ['1', 'all'],
            },
            aliases: ['die', 'kill'],
            permissions: {
                dev: true,
            },
        });
    }
    async run(client, ctx, args) {
        if (!args[0] || args[0] == 'all') {
            await ctx.sendMessage('Shutting down all shards...');
            client.shard.send({ type: 'shutdown', shard: 'all' });
        }
        else if (!isNaN(args[0])) {
            await ctx.sendMessage(`Shutting down shard ${args[0]}...`);
            client.shard.send({ type: 'shutdown', shard: Number(args[0]) });
        }
        else {
            await ctx.sendMessage('Invalid argument. Please specify a shard or "all".');
        }
    }
};