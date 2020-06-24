const Command = require('../../structures/Command');

const play = require('../../utils/music/play.js');
const spawnPlayer = require('../../player/spawnPlayer.js');

module.exports = class Mixer extends Command {
	constructor(client) {
		super(client, {
			name: 'mixer',
			description: 'Plays streams from mixer.',
			args: true,
			usage: '<song link>',
			inVoiceChannel: true,
		});
	}
	async run(client, message, args) {

		const permissions = message.member.voice.channel.permissionsFor(client.user);
		if (!permissions.has('CONNECT')) return client.responses('noPermissionConnect', message);
		if (!permissions.has('SPEAK')) return client.responses('noPermissionSpeak', message);

		let player = client.music.players.get(message.guild.id);
		if (player && player.playing === false) return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);
		if (!player) player = await spawnPlayer(client, message);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		const songLimit = await client.songLimit(message.author.id, player.queue.length);
		if(songLimit) return msg.edit(`You have reached the **maximum** amount of songs (${songLimit} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);

		const searchQuery = {
			source: 'mixer',
			query: args.slice(0).join(' '),
		};

		play(client, message, msg, player, searchQuery, false);
	}
};