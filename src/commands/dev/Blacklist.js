const Command = require('../../structures/Command');
const User = require('../../models/User');

module.exports = class Blacklist extends Command {
    constructor(client) {
        super(client, {
            name: 'blacklist',
            description: {
                content: 'Prevents a user from using the bot on any server.',
                usage: '<user id>',
                examples: ['474328006588891157'],
            },
            args: true,
            permissions: {
                dev: true,
            },
        });
    }
    async run(client, ctx, args) {
        if (!args[0]) return ctx.sendMessage('Please specifiy a user.');
        if (isNaN(args[0])) return ctx.sendMessage('Please specifiy a valid user id.');

        const user = await client.users.fetch(args[0]);
        if (!user) return ctx.sendMessage('User not found. Please make sure to enter the user\'s id.');

        User.findById(user.id, async (err, u) => {
            if (err) client.logger.error(err);
            if (!u) {
                const newUser = new User({
                    _id: user.id,
                    blacklisted: true,
                });
                newUser.save().catch(e => client.log(e));
            }
            else if (u.blacklisted) {
                ctx.sendMessage(`${user.username} is already blacklisted.`);
            }
            else {
                await u.updateOne({ blacklisted: true }).catch(e => client.logger.error(e));
                ctx.sendMessage(`Blacklisted **${user.username}**.`);
            }

        });
    }
};
