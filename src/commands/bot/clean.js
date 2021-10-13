const Command = require('../../structures/Command');

module.exports = class ClearMessages extends Command {
	constructor(client) {
		super(client, {
			name: 'clean',
			description: 'Clear bot\'s messages',
			usage: '<no of message>',
			cooldown: 4,
			botPermissions: ['MANAGE_MESSAGES']
		});
	}
	async run(client, message, args) {
		const botID = process.env.DISCORD_ID;
		let no_of_messages = 0;
		
		if (args.length > 1){
			return message.reply(`Too many arguments!\nCorrect Usage: ${client.settings.prefix}clean <no_of_messages>`);
		}

		if (args[0]){
			no_of_messages = parseInt(args[0])
			if (isNaN(no_of_messages) || no_of_messages < 1){
				return message.channel.send("Invalid argument! no_of_messages must be a positive integer");
			}
		}

		if (message.channel.type == 'text') {
			await message.channel.messages.fetch({limit: 100}).then(messages => {
				let botMessages = messages.filter(msg => msg.author == botID).array();
				if (no_of_messages > 0){
					botMessages.splice(no_of_messages);
				}
				message.channel.bulkDelete(botMessages);
				//botMessages.map(msg => client.log(msg.createdAt));
				client.log(`Deleted ${botMessages.length} messages from ${botID}`)
			}).catch(err => {
				client.log('Error while doing Bulk Delete');
				client.log(err);
			});
		}
	}
};