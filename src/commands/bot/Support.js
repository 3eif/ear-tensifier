const Command = require('../../structures/Command');

module.exports = class Support extends Command {
    constructor(client) {
        super(client, {
            name: 'support',
            description: {
                content: 'Sends a link to Ear Tensifier\'s support server.',
            },
            aliases: ['server'],
            args: false,
            slashCommand: true,
        });
    }

    async run(client, ctx) {
        await ctx.sendMessage(`Here is my support server: ${client.config.server}`);
    }
};
