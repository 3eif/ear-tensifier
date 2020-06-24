const Command = require('../../structures/Command');

const users = require('../../models/user.js');

module.exports = class Profile extends Command {
    constructor(client) {
        super(client, {
            name: 'bio',
            description: 'Sets your bio.',
            usage: '<bio>',
            args: true,
            cooldown: '4',
            aliases: ['setbio', 'set-bio', 'bioset'],
        });
    }
    async run(client, message, args) {
        const msg = await message.channel.send(`${client.emojiList.loading} Setting bio...`);
        if (args.join(' ').length > 500) return msg.edit('Bio must be less than 500 characters!');

        users.findOne({
            authorID: message.author.id,
        }, async (err, u) => {
            if (err) client.log(err);
            if (!u) {
                const newUser = new users({
                    authorID: message.author.id,
                    bio: args.join(' '),
                    songsPlayed: 0,
                    commandsUsed: 0,
                    blocked: false,
                    premium: false,
                    pro: false,
                    developer: false,
                });
                newUser.save().catch(e => client.log(e));
                return msg.edit(`Succesfully set your bio to \`${args.join(' ')}\``);
            }
            else {
                u.bio = args.join(' ');
                u.save().catch(e => console.log(e));
                return msg.edit(`Succesfully set your bio to \`${args.join(' ')}\``);
            }
        });
    }
};