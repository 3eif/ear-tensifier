const Command = require('../../structures/Command');

const commands = require('../../models/command.js');

module.exports = class CommandsUsed extends Command {
	constructor(client) {
		super(client, {
			name: 'commandsused',
			description: 'Shows the most used commands',
			permission: 'dev',
		});
	}
	async run(client, message) {
		const msg = await message.channel.send(`${client.emojiList.loading} Fetching most used commands...`);

		commands.find().sort([['timesUsed', 'descending']]).exec(async (err, res) => {
			if (err) client.log(err);
			const commandsArr = [];

			for (let i = 0; i < 30; i++) {
				try {
					commandsArr.push(`${i + 1}.) ${res[i].timesUsed.toLocaleString()} | ${res[i].commandName}`);
				}
				catch (e) {
					return message.channel.send('An error occured.');
				}
			}

			msg.edit(`**Top Commands**\n\`\`\`${commandsArr.join('\n')}\`\`\``);
		});
	}
};