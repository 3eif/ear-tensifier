const Command = require('../../structures/Command');

module.exports = class Invite extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            description: {
                content: 'Sends a link to invite Ear Tensifier to another server.',
            },
            aliases: ['patreon'],
            args: false,
            slashCommand: true,
        });
    }

    async run(client, ctx) {
        await ctx.sendMessage({content: `You can invite me using this link: ${client.config.invite}`, ephemeral:true);
    }
};
