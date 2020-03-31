const { earrape } = require('../../resources/volume.json');

module.exports = {
	name: 'earrape',
	description: 'Earrapes a song.',
	aliases: ['veryloud', 'hell', 'loud'],
	cooldown: '10',
	inVoiceChannel: true,
	sameVoiceChannel: true,
	playing: true,
	async execute(client, message) {
		const player = client.music.players.get(message.guild.id);

		player.setVolume(earrape);
		player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.5 })));

		return message.channel.send('Tensity set to **earrape**');
	},
};