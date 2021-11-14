const Command = require('../../structures/Command');

module.exports = class Reboots extends Command {
    constructor(client) {
        super(client, {
            name: 'reboot',
            description: {
                content: 'Reboots the bot or a specific cluster if given.',
                usage: '<shard or "all">',
                examples: ['1', 'all'],
            },
            aliases: ['restart'],
            permissions: {
                dev: true,
            },
        });
    }
    async run(client, ctx, args) {
        if (!args[0] || args[0] == 'all') {
            await ctx.sendMessage('Rebooting all clusters...');
            client.shard.send({ type: 'reboot', cluster: 'all' });
        }
        else if (!isNaN(args[0])) {
            await ctx.sendMessage(`Rebooting cluster ${args[0]}...`);
            client.shard.send({ type: 'reboot', cluster: Number(args[0]) });
        }
        else {
            await ctx.sendMessage('Invalid argument. Please specify a cluster or "all".');
        }
    }
};