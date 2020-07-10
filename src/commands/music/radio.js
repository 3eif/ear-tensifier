const Command = require('../../structures/Command');

const RadioBrowser = require('radio-browser');
const spawnPlayer = require('../../player/spawnPlayer.js');

module.exports = class Radio extends Command {
	constructor(client) {
		super(client, {
			name: 'radio',
			description: 'Plays live radio.',
			args: true,
			usage: '<radio channel>',
			inVoiceChannel: true,
			permission: 'premium',
			botPermissions: ['CONNECT', 'SPEAK'],
		});
	}
	async run(client, message, args) {
		const query = args.join(' ');
		if (!args[0]) return message.channel.send('Please provide a song name or link to search.');

		let player = client.music.players.get(message.guild.id);
		if (player && player.playing === false && player.current) return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);
		if (!player) player = await spawnPlayer(client, message);

		const filter = {
			limit: 1,
			by: 'name',
			searchterm: query,
		};
		let str = '';
		await RadioBrowser.getStations(filter)
			.then(data => {
				// eslint-disable-next-line no-undef
				data.forEach(item => {
					str = item.url;
				});
			});
		if (str.length === 0) return message.channel.send('Invalid radio station.');
		await client.music.search(str, message.author).then(async res => {
			switch (res.loadType) {
			case 'TRACK_LOADED':
				player.queue.add(res.tracks[0]);
				if (!player.playing) {
					player.play();
				}
				else {
					return message.channel.send('', client.queuedEmbed(
						res.tracks[0].title,
						null,
						res.tracks[0].duration,
						null,
						res.tracks[0].requester,
					));
				}
			}
		});
	}
};