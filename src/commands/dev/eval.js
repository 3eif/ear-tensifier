const Command = require('../../structures/Command');

const Discord = require('discord.js');
const { loading } = require('../../../config/emojis.js');
const { invisible } = require('../../../config/colors.js');
const { inspect } = require('util');
const { post } = require('snekfetch');

module.exports = class Eval extends Command {
	constructor(client) {
		super(client, {
			name: 'eval',
			description: 'Runs the code you give it.',
			usage: '<code>',
			args: true,
			permission: 'dev',
		});
	}
	async run(client, message, args) {
		const msg = await message.channel.send(`${loading} Executing code...`);

		const code = args.join(' ');
		let evaled = eval(code);
		if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled); }
		if (evaled.includes(client.token)) {
			return msg.edit('Nah fam');
		}

		try {
			let output = eval(code);
			if (output instanceof Promise || (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function')) output = await output;
			output = inspect(output, { depth: 0, maxArrayLength: null });
			output = clean(output);
			if (output.length < 1000) {
				const embed = new Discord.MessageEmbed()
					.addField('Input', `\`\`\`js\n${code}\`\`\``)
					.addField('Output', `\`\`\`js\n${output}\`\`\``)
					.setColor(invisible);
				msg.edit('', embed);
			}
			else {
				const { body } = await post('https://www.hastebin.com/documents').send(output);
				const embed = new Discord.MessageEmbed()
					.setTitle('Output was too long, uploaded to hastebin!')
					.setURL(`https://www.hastebin.com/${body.key}.js`)
					.setColor(invisible);
				msg.edit('', embed);
			}
		}
		catch (e) {
			message.channel.send(`Error \`\`\`js\n${e}\`\`\``);
		}
	}
};

function clean(text) {
	return text
		.replace(/`/g, '`' + String.fromCharCode(8203))
		.replace(/@/g, '@' + String.fromCharCode(8203));
}