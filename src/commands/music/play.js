const Command = require('../../structures/Command');

const play = require('../../player/loadTracks.js');
const spawnPlayer = require('../../player/spawnPlayer.js');
const { getData, getPreview } = require('spotify-url-info');

module.exports = class Play extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			description: 'Plays a song',
			usage: '<search query>',
			aliases: ['p'],
			cooldown: '4',
			args: true,
			inVoiceChannel: true,
			botPermissions: ['CONNECT', 'SPEAK'],
		});
	}
	async run(client, message, args) {
		let player = client.music.players.get(message.guild.id);
		if (player && player.playing === false && player.queue.current) return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);
		if (!player) player = await spawnPlayer(client, message);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		const songLimit = await client.songLimit(message.author.id, player.queue.length);
		if (songLimit) return msg.edit(`You have reached the **maximum** amount of songs (${songLimit} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);

		let searchQuery;
		searchQuery = args.join(' ');
		if (['youtube', 'soundcloud', 'bandcamp', 'mixer', 'twitch'].includes(args[0].toLowerCase())) {
			searchQuery = {
				source: args[0],
				query: args.slice(1).join(' '),
			};
		}
		play(client, message, msg, player, searchQuery, false);

	}
};
