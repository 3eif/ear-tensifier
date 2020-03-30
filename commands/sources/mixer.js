const play = require('../../utils/play.js');

module.exports = {
	name: 'mixer',
	description: 'Plays a stream from mixer.',
	args: true,
	usage: '<stream link>',
	inVoiceChannel: true,
	async execute(client, message, args) {
		if (!args[0]) return message.channel.send('Please provide a search query.');

		const permissions = message.member.voice.channel.permissionsFor(client.user);
		if(!permissions.has('CONNECT')) return client.responses('noPermissionConnect', message);
		if(!permissions.has('SPEAK')) return client.responses('noPermissionSpeak', message);

		let player = client.music.players.get(message.guild.id);

		if (!player) {
			player = client.music.players.spawn({
				guild: message.guild,
				textChannel: message.channel,
				voiceChannel: message.member.voice.channel,
			});
		}

		if (player.pause == 'paused') return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		let searchQuery = args.join(' ');
		searchQuery = {
			source: 'mixer',
			query: args.slice(0).join(' '),
		};
		play(client, message, msg, player, searchQuery, false);
	},
};