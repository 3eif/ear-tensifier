const Command = require('../../structures/Command');

module.exports = class Donate extends Command {
    constructor(client) {
        super(client, {
            name: 'donate',
            description: {
                content: 'Sends a link to Ear Tensifier\'s patreon page.',
            },
            aliases: ['patreon'],
            args: false,
            slashCommand: true,
        });
    }

    async run(client, ctx) {
        await ctx.sendMessage({content:`You can support Ear Tensifier here: ${client.config.patreon}`, ephemeral:true});
    }
};
