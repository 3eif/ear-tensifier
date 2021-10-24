const Command = require('../../structures/Command');

module.exports = class Clean extends Command {
	constructor(client) {
		super(client, {
			name: 'clean',
			description: 'Bulk deletes X amount of messages sent by the bot (deletes the last 100 messages by default).',
			usage: '<number of message>',
			cooldown: 5
		});
	}
	async run(client, message, args) {
		if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('You must have the `Manage Messages` permission to use this command.');

		let messagesToDelete = 0;

		if (args[0]) {
			messagesToDelete = parseInt(args[0])
			if (isNaN(messagesToDelete) || messagesToDelete < 1) {
				return message.channel.send({ content: `Invalid argument, argument must be a number.\nCorrect Usage: \`${client.settings.prefix}clean <number messages>\`` });
			}
		}

		if (message.channel.type == 'text') {
			await message.channel.messages.fetch({ limit: 50 }).then(messages => {
				let botMessages = messages.filter(msg => msg.author == message.guild.me.id).array();
				if (messagesToDelete > 0) {
					botMessages.splice(messagesToDelete);
				}
				message.channel.bulkDelete(botMessages);
			}).catch(err => {
				client.log('Error while doing bulk delete');
				client.log(err);
			});
		}
	}
};