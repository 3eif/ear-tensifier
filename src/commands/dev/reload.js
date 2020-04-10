const Command = require('../../structures/Command');

module.exports = class Reload extends Command {
	constructor(client) {
		super(client, {
			name: 'reload',
			description: 'Reloads a command',
			args: true,
			usage: '<category> <command>',
			permissions: 'dev',
		});
	}
	async run(client, message, args) {
		if (message.author.id !== client.settings.devs) return;
		if (!args[1]) return message.channel.send('Please provide a command.');

		const commandName = args[1].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`../${args[0]}/${commandName}.js`)];

		try {
			const newCommand = require(`../${args[0]}/${commandName}.js`);
			message.client.commands.set(newCommand.name, newCommand);
		}
		catch (error) {
			client.log(error);
			return message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
		}
		message.channel.send(`Command \`${commandName}\` was reloaded!`);
	}
};