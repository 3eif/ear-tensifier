const { ErelaClient } = require('erela.js');
const trackStart = require('./trackStart.js');
// eslint-disable-next-line no-unused-vars
const autoPlay = require('./queueEnd.js');

module.exports = async (client) => {
	const nodes = [{
		host: process.env.LAVALINK_HOST,
		port: process.env.LAVALINK_PORT,
		password: process.env.LAVALINK_PASSWORD,
	}];

	client.music = new ErelaClient(client, nodes);
	client.music.on('nodeError', (node, error) => client.log(`Node error: ${error.message}`));
	client.music.on('queueEnd', player => {
		return client.music.players.destroy(player.guild.id);
	});
	client.music.on('trackStart', ({ textChannel }, { title, duration, author, uri, requester }) => {
		trackStart(client, textChannel, title, duration, author, uri, requester);
	});
};