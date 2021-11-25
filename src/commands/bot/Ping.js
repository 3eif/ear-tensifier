const Command = require('../../structures/Command');

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: {
                content: 'Displays the bot\'s latency.',
            },
            aliases: ['latency'],
            args: false,
            slashCommand: true,
        });
    }

    async run(client, ctx) {
        const msg = await ctx.sendDeferMessage(`${client.config.emojis.typing} Pinging...`);
        client.emit('guildCreate', {
            id: '123456789',
            name: 'test',
            icon: '',
            memberCount: 0,
            large: false,
            unavailable: false,
        });
        return ctx.editMessage(`Pong! (Latency: ${msg.createdTimestamp - ctx.createdTimestamp}ms. API Latency: ${Math.round(client.ws.ping)}ms.)`);
    }
};
