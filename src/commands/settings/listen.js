const Command = require('../../structures/Command');

const Discord = require('discord.js');
const servers = require('../../models/server.js');

module.exports = class Listen extends Command {
	constructor(client) {
		super(client, {
			name: 'listen',
			description: 'The bot will resume responding to commands from the channel.',
			usage: '<channel>',
			args: true,
		});
	}
	async run(client, message, args) {
		if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send('You must have the `Manage Channels` permission to use this command.');

		const msg = await message.channel.send(`${client.emojiList.loading} Listening to commands from channel...`);

		let channel;
		if (message.mentions.channels.first() === undefined) {
			if (!isNaN(args[0])) channel = args[0];
			else msg.edit('No channel detected.');
		}
		else {
			channel = message.mentions.channels.first().id;
		}

		servers.findOne({
			serverID: message.guild.id,
		}, async (err, s) => {
			if (err) client.log(err);
			if (!s) {
				const newSever = new servers({
					serverID: message.guild.id,
					prefix: 'ear ',
					feed: '',
					ignore: [],
				});
				await newSever.save().catch(e => client.log(e));
				return msg.edit('This channel is not being ignored!');
			}
			if (s.ignore.includes(channel)) {
				for (let i = 0; i < s.ignore.length; i++) {
					if (s.ignore[i] === channel) {
						s.ignore.splice(i, 1);
						await s.save().catch(e => client.log(e));
						break;
					}
				}
			}
			else {
				return msg.edit('This channel is not being ignored!');
			}

			const embed = new Discord.MessageEmbed()
				.setAuthor(`${message.guild.name}`, message.guild.iconURL())
				.setColor(client.colors.main)
				.setDescription(`I will now listen to commands from ${args[0]}`);
			msg.edit('', embed);
		});
	}
};