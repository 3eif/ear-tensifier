const play = require('../../utils/play.js');

module.exports = {
	name: 'twitch',
	description: 'Plays a stream from Twitch.',
	args: true,
	usage: '<stream link>',
	async execute(client, message, args) {
		const voiceChannel = message.member.voice;
		if(!voiceChannel) return client.responses('noVoiceChannel', message);

		const permissions = voiceChannel.permissions.has(client.user);
		if(!permissions.has('CONNECT')) return client.responses('noPermissionConnect', message);
		if(!permissions.has('SPEAK')) return client.responses('noPermissionSpeak', message);

		const player = client.music.players.spawn({
			guild: message.guild,
			textChannel: message.channel,
			voiceChannel: voiceChannel,
		});

		if (player.pause == 'paused') return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		let searchQuery = args.join(' ');
		searchQuery = {
			source: 'twitch',
			query: args.slice(0).join(' '),
		};
		play(client, message, msg, player, searchQuery, false);
	},
};