const Command = require('../../structures/Command');

const Discord = require('discord.js');
const fs = require('fs');
const categories = fs.readdirSync('./src/commands/');

module.exports = class Help extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			description: 'Sends you a detailed list of Ear Tensifier\'s commands.',
			aliases: ['commands', 'list'],
			cooldown: '5',
			usage: '[command name]',
		});
	}
	async run(client, message, args) {

		const msg = await message.channel.send(`${client.emojiList.typing} Sending a list of my commands...`);

		const { commands } = message.client;
		const data = [];

		const embed = new Discord.MessageEmbed()
			.setAuthor('Commands', client.settings.avatar)
			.setDescription(`A detailed list of commands can be found here: [eartensifier.net/commands](https://eartensifier.net/commands)\nNeed more help? Join the support server [here](${client.settings.server})`)
			.setFooter(`For more information: ${client.settings.prefix}help <command>`)
			.setColor(client.colors.main);

		if (!args.length) {

			categories.forEach(async (category) => {
				if (category == 'dev') return;

				const helpCommands = [];
				let categoryCommands = '';
				const commandsFile = fs.readdirSync(`./src/commands/${category}`).filter(file => file.endsWith('.js'));

				for (let i = 0; i < commandsFile.length; i++) {
					const commandName = commandsFile[i].split('.')[0];
					if(!client.settings.hiddenCommands.includes(commandName) && i < commandsFile.length - 1) helpCommands.push(`\`${commandName}\`,  `);
					else if(!client.settings.hiddenCommands.includes(commandName)) helpCommands.push(`\`${commandName}\``);
				}

				for (let i = 0; i < helpCommands.length; i++) categoryCommands += helpCommands[i];
				const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
				embed.addField(`${categoryName} (${commandsFile.length})`, categoryCommands);
			});

			await msg.edit('', embed);
			message.channel.send(`Need more help? Join the support server: ${client.settings.server}`);
		}
		else {

			if (!commands.has(args[0])) {
				return msg.edit('That\'s not a valid command!');
			}
			const command = commands.get(args[0]);

			data.push(`**Name:** ${command.name}`);

			if (command.description) data.push(`**Description:** ${command.description}`);
			if (command.aliases == 'No aliases for this certain command') data.push('**Aliases:** This command has no aliases');
			else data.push(`**Aliases:** \`${command.aliases}\``);
			if (command.usage == 'No usage provided') data.push(`**Usage:** \`${client.settings.prefix}${command.name}\``);
			else data.push(`**Usage:** \`${client.settings.prefix}${command.name} ${command.usage}\``);

			data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

			msg.delete();
			message.channel.send(data, { split: true });
		}
	}
};

