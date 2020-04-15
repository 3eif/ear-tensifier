const Command = require('../../structures/Command');

const play = require('../../utils/play.js');
const spawnPlayer = require('../../utils/spawnPlayer.js');

module.exports = class Twitch extends Command {
	constructor(client) {
		super(client, {
			name: 'twitch',
			description: 'Plays a stream from Twitch.',
			args: true,
			usage: '<stream link>',
			inVoiceChannel: true,
		});
	}
	async run(client, message, args) {
		if (!args[0]) return message.channel.send('Please provide a search query.');

		const permissions = message.member.voice.channel.permissionsFor(client.user);
		if (!permissions.has('CONNECT')) return client.responses('noPermissionConnect', message);
		if (!permissions.has('SPEAK')) return client.responses('noPermissionSpeak', message);

		let player = client.music.players.get(message.guild.id);
		if (player.playing == false && player) return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);
		if (!player) player = await spawnPlayer(client, message);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		const searchQuery = {
			source: 'twitch',
			query: args.slice(0).join(' '),
		};

		play(client, message, msg, player, searchQuery, false);
	}
};