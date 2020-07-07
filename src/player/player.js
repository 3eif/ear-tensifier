const { Manager } = require('lavaclient');
const trackStart = require('./trackStart.js');
const trackEnd = require('./trackEnd.js');
const queueEnd = require('./queueEnd.js');

module.exports = async (client) => {
	const nodes = [
		{
			id: 'main',
			host: process.env.LAVALINK_HOST,
			port: process.env.LAVALINK_PORT,
			password: process.env.LAVALINK_PASSWORD,
		},
	];

	client.music = new Manager(nodes, {
		shards: client.shard.count,
		send(id, data) {
			const guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(data);
			return;
		},
	});
	// .on('nodeError', (node, error) => client.log(`Node error: ${error.message}`))
	// .on('queueEnd', player => {
	// 	queueEnd(client, player);
	// })
	// .on('trackStart', ({ textChannel }, { title, duration, author, uri }) => {
	// 	trackStart(client, textChannel, title, duration, author, uri);
	// })
	// .on('trackEnd', player => {
	// 	trackEnd(client, player);
	// })
	// .on('playerMove', (player, currentChannel, newChannel) => {
	// 	player.voiceChannel = client.channels.cache.get(newChannel);
	// });
};