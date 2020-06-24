const Command = require('../../structures/Command');

module.exports = class Ping extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			description: 'Bot latency',
			usage: '',
			enabled: true,
			cooldown: 4,
			args: false,
		});
	}
	async run(client, message) {
		const msg = await message.channel.send(`${client.emojiList.loading} Pinging...`);
		return msg.edit(`Pong! (Latency: ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency: ${Math.round(client.ws.ping)}ms.)`);
	}
};