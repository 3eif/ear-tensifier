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
		});
	}
	async run(client, message, args) {
		const permissions = message.member.voice.channel.permissionsFor(client.user);
		if(!permissions.has('CONNECT')) return client.responses('noPermissionConnect', message);
		if(!permissions.has('SPEAK')) return client.responses('noPermissionSpeak', message);

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
					return message.channel.send(`**${res.tracks[0].title}** [Live] has been added to the queue by **${res.tracks[0].requester.tag}**`);
				}
			}
		});
	}
};