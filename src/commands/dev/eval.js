const Command = require('../../structures/Command');

const { MessageEmbed } = require('discord.js');
const { loading } = require('../../../config/emojis.js');
const util = require('util');
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

		const player = client.music.players.get(message.guild.id);

		try {
			let code = args[0] == '-a' ? args.slice(1).join(' ') : args.join(' ');
			let fullCode = args[0] == '-a' ? '(async () => {\n{code}\n})()' : '{code}';
			let str = fullCode.replace('{code}', code);
			let output = util.inspect(await eval(str), { depth: 0 });

			if (output.includes(process.env.DISCORD_TOKEN)) return msg.edit('Cannot run command since the token will be leaked.');

			if (output.length < 1000) {
				const embed = new MessageEmbed()
					.addField('Input', `\`\`\`js\n${code}\`\`\``)
					.addField('Output', `\`\`\`js\n${output}\`\`\``);
				return msg.edit({ content: ' ', embeds: [embed] });
			} else {
				const res = await post('https://hastebin.com/documents', { body: output });
				const embed = new MessageEmbed()
					.setTitle('Output was too long, uploaded to hastebin!')
					.setURL(`https://www.hastebin.com/${res.data.key}.js`);
				return msg.edit({ content: ' ', embeds: [embed] });
			}
		} catch (e) {
			return msg.edit(`An error occurred: \n\`\`\`js\n${e.message}\`\`\``).catch(console.error);
		}
	}
};
