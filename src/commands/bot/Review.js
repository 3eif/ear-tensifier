const Command = require('../../structures/Command');

module.exports = class Review extends Command {
    constructor(client) {
        super(client, {
            name: 'review',
            description: {
                content: 'Sends a link to review Ear Tensifier on bots.ondiscord.xyz.',
            },
            args: false,
            slashCommand: false,
            hide: true,
        });
    }

    async run(client, ctx) {
        await ctx.sendMessage(`You can give me a review here: ${client.config.review}`);
    }
};
