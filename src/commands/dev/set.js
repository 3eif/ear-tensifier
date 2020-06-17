const Command = require('../../structures/Command');

const users = require('../../models/user.js');

module.exports = class Set extends Command {
    constructor(client) {
        super(client, {
            name: 'set',
            description: 'Adds a user to a specific group.',
            usage: '<user> <group(voter, premium, pro, mod)> <true/false>',
            args: true,
            permissions: 'dev',
        });
    }
    async run(client, message, args) {
        if (!args[0]) return message.channel.send('Please specifiy a user.');
        if (!args[1]) return message.channel.send('Please specify a group to add the user to.');
        if (!args[2]) return message.channel.send('Please specify true or false.');

        // const groups = ['premium', 'pro', 'voter', 'mod', 'moderator'];
        // if (!args[1].toLowerCase().includes(groups)) return message.channel.send('That\'s not a valid group. Valid groups: premium, pro, mod, voter.');

        const msg = await message.channel.send(`${client.emojiList.loading} Setting values...`);

        const user = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!user) return msg.edit(client.responses.noUser);

        users.findOne({
            authorID: user.id,
        }, async (err, u) => {
            if (err) console.log(err);
            if (args[1].toLowerCase() === 'premium') {
                u.premium = `${args[2]}`;
            }
            else if (args[1].toLowerCase() === 'pro') {
                u.premium = `${args[2]}`;
                u.pro = `${args[2]}`;
            }
            else if (args[1].toLowerCase() === 'mod' || args[1].toLowerCase() === 'moderator') {
                u.moderator = `${args[2]}`;
            }
            else if (args[1].toLowerCase() === 'voter') {
                u.lastVoted = Date.now();
                u.voted = `${args[2]}`;
                u.votedConst = `${args[2]}`;
            }

            msg.edit(`Set **${args[1]}** to **${args[2]}** for **${user.user.tag}**`);
            await u.save().catch(e => console.log(e));
        });
    }
};