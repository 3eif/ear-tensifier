const Command = require('../../structures/Command');

const play = require('../../player/loadTracks.js');
const spawnPlayer = require('../../player/spawnPlayer.js');

module.exports = class Spotify extends Command {
	constructor(client) {
		super(client, {
			name: 'spotify',
			description: 'Plays a spotify track.',
			usage: '<spotify link>',
			cooldown: '4',
			args: true,
			inVoiceChannel: true,
			botPermissions: ['CONNECT', 'SPEAK'],
		});
	}
	async run(client, message, args) {
		let player = client.music.players.get(message.guild.id);
		if (!player) player = await spawnPlayer(client, message);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		const songLimit = await client.songLimit(message.author.id, player.queue.length);
		if (songLimit) return msg.edit(`You have reached the **maximum** amount of songs (${songLimit} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);

		if (args[0].startsWith(client.settings.spotifyURL)) {
			let searchQuery;
			searchQuery = args.join(' ');
			if (['youtube', 'soundcloud', 'bandcamp', 'twitch'].includes(args[0].toLowerCase())) {
				if (args[0].toLowerCase().includes('soundcloud')) return message.channel.send("Soundcloud has been temporarily disabled.")
				searchQuery = {
					source: args[0],
					query: args.slice(1).join(' '),
				};
			}
			play(client, message, msg, player, searchQuery, false);
		}
		else {
			return msg.edit({ content: 'Please provide a spotify album or track url.' });
		}
	}
};