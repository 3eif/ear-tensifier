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
		if (player && player.playing === false && player.current) return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);
		if (!player) player = await spawnPlayer(client, message);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		const songLimit = await client.songLimit(message.author.id, player.queue.length);
		if(songLimit) return msg.edit(`You have reached the **maximum** amount of songs (${songLimit} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);

		let searchQuery;
		if (args[0].startsWith(client.settings.spotifyURL)) {
			const data = await getData(args.join(' '));
			if (data.type == 'playlist' || data.type == 'album') {
				const sL = await client.getSongLimit(message.author.id);
				let songsToAdd = 0;
				if (!player.queue.length) { songsToAdd = Math.min(sL, data.tracks.items.length); }
				else {
					const totalSongs = player.queue.length + data.tracks.items.length;
					if (totalSongs > sL) songsToAdd = Math.min(sL - player.queue.length, data.tracks.items.length);
					else songsToAdd = data.tracks.items.length;
				}
				if (data.type == 'playlist') {
					for (let i = 0; i < songsToAdd; i++) {
						const song = data.tracks.items[i];
						play(client, message, msg, player, `${song.track.name} ${song.track.artists[0].name}`, true);
					}
				}
				else {
					await data.tracks.items.forEach(song => {
						play(client, message, msg, player, `${song.name} ${song.artists[0].name}`, true);
					});
				}
				const playlistInfo = await getPreview(args.join(' '));
				if (data.tracks.items.length != songsToAdd) msg.edit('', client.queuedEmbed(playlistInfo.title, args[0], null, songsToAdd, message.author).setFooter('You have reached the max amount of songs in the queue. Purchase premium or pro to get more.'));
				else msg.edit('', client.queuedEmbed(playlistInfo.title, args[0], null, songsToAdd, message.author));
			}
			else if (data.type == 'track') {
				const track = await getPreview(args.join(' '));
				play(client, message, msg, player, `${track.title} ${track.artist}`, false);
			}
		}
		else {
			searchQuery = args.join(' ');
			if (['youtube', 'soundcloud', 'bandcamp', 'mixer', 'twitch'].includes(args[0].toLowerCase())) {
				searchQuery = {
					source: args[0],
					query: args.slice(1).join(' '),
				};
			}
			play(client, message, msg, player, searchQuery, false);
		}
	}
};
