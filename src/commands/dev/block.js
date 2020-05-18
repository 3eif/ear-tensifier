const Command = require('../../structures/Command');

const users = require('../../models/user.js');

module.exports = class Block extends Command {
	constructor(client) {
		super(client, {
			name: 'block',
			description: 'Prevents a user from using the bot on any server.',
			usage: '<user> <reason>',
			args: true,
			permission: 'dev',
		});
	}
	async run(client, message, args) {
		if (!args[0]) return message.channel.send('Please specifiy a user.');
		const reason = args.slice(1).join(' ');
		if (!reason) return message.channel.send('Please specify a reason for blocking this user.');

		const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!user) return message.channel.send('Not a valid user.');

		const msg = await message.channel.send(`${client.emojiList.loading} Blocking user from bot...`);

		users.findOne({
			authorID: user.id,
		}, async (err, u) => {
			if (err) client.log(err);
			if (!u) {
				const newUser = new users({
					authorID: user.id,
					bio: '',
					songsPlayed: 0,
					commandsUsed: 0,
					blocked: true,
					premium: false,
					pro: false,
					developer: false,
				});
				newUser.save().catch(e => client.log(e));
			}
			else if (u.blocked) {
				return msg.edit('That user is already blocked.');
			}
			else {
				u.blocked = true;
				await u.save().catch(e => client.log(e));
			}

			msg.edit(`Blocked **${user.user.tag}** from the bot.`);
		});
	}
};
