const Command = require('../../structures/Command');
const User = require('../../models/User.js');

module.exports = class Bio extends Command {
    constructor(client) {
        super(client, {
            name: 'bio',
            description: {
                content: 'Sets your profile\'s bio.',
                usage: '<bio>',
                examples: ['Hello, I\'m a bot!'],
            },
            args: true,
            cooldown: '4',
            aliases: ['setbio', 'set-bio', 'bioset'],
        });
    }
    async run(client, ctx, args) {
        if (ctx.guild.id == '441290611904086016') return;

        if (args.join(' ').length > 1000) return ctx.sendMessage('Bio must be less than 1000 characters!');
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Setting bio...`);

        User.findById(ctx.author.id, async (err, u) => {
            if (err) client.logger.error(err);
            if (!u) return;

            u.bio = args.join(' ');
            u.updateOne({ bio: args.join(' ') }).catch(err => client.logger.error(err));

            return ctx.editMessage(`Succesfully set your bio to \`${args.join(' ')}\``);
        });
    }
};