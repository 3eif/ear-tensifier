const Command = require('../../structures/Command');

const Discord = require('discord.js');
const users = require('../../models/user.js');

module.exports = class Profile extends Command {
	constructor(client) {
		super(client, {
			name: 'profile',
			description: 'Displays the user\'s profile',
			usage: '<user>',
		});
	}
	async run(client, message, args) {
		const msg = await message.channel.send(`${client.emojiList.loading} Fetching profile...`);

		const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
		if (!user) return msg.edit('User not found');

		users.findOne({
			authorID: user.id,
		}, async (err, u) => {
			if (err) client.log(err);
			let ranks = '';
			if (!u) {
				const newUser = new users({
					authorID: user.id,
					bio: '',
					songsPlayed: 0,
					commandsUsed: 0,
					blocked: false,
					premium: false,
					pro: false,
					developer: false,
				});
				newUser.save().catch(e => client.log(e));
				const embed = new Discord.MessageEmbed()
					.setThumbnail(user.user.displayAvatarURL())
					.addField('User', `${user.user.tag}`, true)
					.addField('Bio', 'No bio set')
					.setColor(client.colors.main)
					.setFooter('Commands Used: 1 | Songs Played: 0')
					.setTimestamp();
				return msg.edit('', embed);
			}
			else {

				if (u.voted) ranks += ' ' + client.emojiList.voted;
				if (u.premium) ranks += ' ' + client.emojiList.supporter;
				if (u.moderator) ranks += ' ' + client.emojiList.mod;

				let bio;
				if (!u.bio) bio = 'No bio set. To set your bio type `ear bio <desired bio>`';
				else bio = u.bio;

				const embed = new Discord.MessageEmbed()
					.setThumbnail(user.user.displayAvatarURL())
					.addField('User', `${user.user.tag}${ranks}`, true)
					.addField('Bio', `${bio}`)
					.setColor(client.colors.main)
					.setFooter(`Commands Used: ${u.commandsUsed} | Songs Played: ${u.songsPlayed}`)
					.setTimestamp();
				return msg.edit('', embed);
			}
		});
	}
};