const { ErelaClient, Player } = require('erela.js');
const trackStart = require('./trackStart.js');
// eslint-disable-next-line no-unused-vars
const autoPlay = require('./queueEnd.js');

module.exports = async (client) => {
	const nodes = [{
		host: process.env.LAVALINK_HOST,
		port: process.env.LAVALINK_PORT,
		password: process.env.LAVALINK_PASSWORD,
	}];

	class CustomPlayer extends Player {
		constructor(...args) {
			super(...args);
		}

		setTimescale(speed, pitch, rate) {
			this.node.send({
				op: 'filters',
				guildId: this.guild.id,
				timescale: {
					speed,
					pitch,
					rate,
				},
			});
		}
	}

	client.music = new ErelaClient(client, nodes, {
        player: CustomPlayer,
	});
	client.music.on('nodeError', (node, error) => client.log(`Node error: ${error.message}`));
	client.music.on('queueEnd', player => {
		return client.music.players.destroy(player.guild.id);
	});
	client.music.on('trackStart', ({ textChannel }, { title, duration, author, uri, requester }) => {
		trackStart(client, textChannel, title, duration, author, uri, requester);
	});
};