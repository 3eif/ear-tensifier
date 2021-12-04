const Command = require('../../structures/Command');

module.exports = class Website extends Command {
    constructor(client) {
        super(client, {
            name: 'website',
            description: {
                content: 'Sends a link to Ear Tensifier\'s website.',
            },
            aliases: ['site'],
            args: false,
            slashCommand: true,
        });
    }

    async run(client, ctx) {
        await ctx.sendMessage(client.config.website);
    }
};
