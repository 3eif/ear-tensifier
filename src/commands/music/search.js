/* eslint-disable no-case-declarations */
const Command = require('../../structures/Command');

const Discord = require('discord.js');


const spawnPlayer = require('../../player/spawnPlayer.js');

module.exports = class Search extends Command {
	constructor(client) {
		super(client, {
			name: 'search',
			description: 'Provides a variety of search results for a song.',
			usage: '<search query>',
			args: true,
			inVoiceChannel: true,
		});
	}
	async run(client, message, args) {
		const permissions = message.member.voice.channel.permissionsFor(client.user);
		if (!permissions.has('CONNECT')) return client.responses('noPermissionConnect', message);
		if (!permissions.has('SPEAK')) return client.responses('noPermissionSpeak', message);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		let player = client.music.players.get(message.guild.id);
		if (player && player.playing === false && player.current) return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);
		if (!player) player = await spawnPlayer(client, message);

		const songLimit = await client.songLimit(message.author.id, player.queue.length);
		if(songLimit) return msg.edit(`You have reached the **maximum** amount of songs (${songLimit} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);

		const searchQuery = args.join(' ');
		const source = { soundcloud: 'sc' }[searchQuery.source] || 'yt';

		let search = searchQuery.query || searchQuery;
		if (!/^https?:\/\//.test(search)) search = `${source}search:${search}`;

		const tries = 5;
		for(let i = 0; i < tries; i++) {
			const res = await player.manager.search(search);
			if(res.loadType != 'NO_MATCHES') {
				if (res.loadType == 'TRACK_LOADED') {
					player.queue.add([res.tracks[0].track], message.author.id);
					msg.edit('', client.queuedEmbed(
						res.tracks[0].info.title,
						res.tracks[0].info.uri,
						res.tracks[0].info.duration,
						null,
						res.tracks[0].info.requester,
					));
					if (!player.playing) player.queue.start();
					break;
				}
				else if (res.loadType == 'SEARCH_RESULT') {
					let n = 0;
					const tracks = res.tracks.slice(0, 10);

					const results = res.tracks
						.slice(0, 10)
						.map(result => `**${++n} -** [${result.info.title}](${result.info.uri})`)
						.join('\n');

					const embed = new Discord.MessageEmbed()
						.setAuthor('Song Selection.', message.author.displayAvatarURL())
						.setDescription(results)
						.setFooter('Your response time closes within the next 30 seconds. Type "cancel" to cancel the selection, type "queueall" to queue all songs.')
						.setColor(client.colors.main);
					await msg.edit('', embed);

					const filter = m =>
						(message.author.id === m.author.id) &&
						((parseInt(m.content) >= 1 && parseInt(m.content) <= tracks.length) || m.content.toLowerCase() === 'queueall' || m.content.toLowerCase() === 'cancel');

					try {
						const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] });
						const entry = response.first().content.toLowerCase();
						if (entry === 'queueall') {
							for (const track of tracks) {
								player.queue.add([track.track], message.author.id);
							}
							msg.edit('', client.queuedEmbed(
								null,
								null,
								null,
								tracks.length,
								tracks[0].requester,
							));
						}
						else if(entry === 'cancel') {
							message.channel.send('Cancelled selection');
						}
						else {
							const track = tracks[entry - 1];
							player.queue.add([track.track], message.author);
							message.channel.send('', client.queuedEmbed(
								res.tracks[0].info.title,
								res.tracks[0].info.uri,
								track.duration,
								null,
								res.tracks[0].info.requester,
							));
						}
						if (!player.paused && !player.playing) player.queue.start();
					}
					catch (err) {
						message.channel.send('Cancelled selection.');
					}
					break;
				}
				else if (res.loadType == 'PLAYLIST_LOADED') {
					player.queue.add(res.tracks.map((t) => t.track), message.author.id);
					msg.edit('', client.queuedEmbed(
						res.playlist.info.name,
						res.playlist.info.uri,
						res.playlist.tracks.reduce((acc, cure) => ({
							duration: acc.duration + cure.duration,
						})).duration,
						res.playlist.tracks.length,
						res.playlist.tracks[0].requester.id,
					));
					if (!player.paused && !player.playing) player.queue.start();
					break;
				}
				else if(res.loadType == 'LOAD_FAILED') {
					msg.edit('An error occured. Please try again.');
					break;
				}
			}
			else if(i >= 4 && res.loadType != 'PLAYLIST_LOADED') return msg.edit('No tracks found.');
		}
	}
};