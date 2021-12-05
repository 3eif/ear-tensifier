const Command = require('../../structures/Command');

module.exports = class Vote extends Command {
    constructor(client) {
        super(client, {
            name: 'vote',
            description: {
                content: 'Sends a link to vote for Ear Tensifier on top.gg.',
            },
            aliases: ['top.gg'],
            args: false,
            slashCommand: false,
            hide: true,
        });
    }

    async run(client, ctx) {
        await ctx.sendMessage(`You can vote for me here: ${client.config.vote}`);
    }
};
