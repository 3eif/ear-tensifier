const tokens = require('../tokens.json');
const { ErelaClient } = require('erela.js');
const trackStart = require('./trackStart.js');
// eslint-disable-next-line no-unused-vars
const autoPlay = require('./queueEnd.js');

module.exports = async (client) => {
	client.music = new ErelaClient(client, tokens.nodes);
	// eslint-disable-next-line no-unused-vars
    client.music.on('nodeConnect', node => console.log('New node connected'));
    client.music.on('nodeError', (node, error) => console.log(`Node error: ${error.message}`));
	client.music.on('queueEnd', player => {
		// player.textChannel.send("");
		// autoPlay(client, player);
		return client.music.players.destroy(player.guild.id);
	});
	client.music.on('trackStart', ({ textChannel }, { title, duration, author, uri, requester }) => {
		trackStart(client, textChannel, title, duration, author, uri, requester);
	});
};