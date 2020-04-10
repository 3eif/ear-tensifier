const Command = require('../../structures/Command');

module.exports = class Shutdown extends Command {
	constructor(client) {
		super(client, {
			name: 'shutdown',
			description: 'Shuts down the bot.',
			permission: 'dev',
		});
	}
	async run(client, message) {
		const msg = await message.channel.send('Powering off...');

		try {
			process.exit();
		}
		catch (e) {
			client.error(e, true, msg);
		}
	}
};