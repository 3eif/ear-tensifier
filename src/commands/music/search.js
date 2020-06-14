/* eslint-disable no-case-declarations */
const Command = require('../../structures/Command');

const Discord = require('discord.js');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);

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
		if (!args[0]) return message.channel.send('Please provide a search query.');
		if (!message.member.voice.channel) return client.responses('noVoiceChannel', message);

		const permissions = message.member.voice.channel.permissionsFor(client.user);
		if (!permissions.has('CONNECT')) return client.responses('noPermissionConnect', message);
		if (!permissions.has('SPEAK')) return client.responses('noPermissionSpeak', message);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		let player = client.music.players.get(message.guild.id);
		if (!player) player = await spawnPlayer(client, message);

		const tries = 5;
		for(let i = 0; i < tries; i++) {
			const res = await client.music.search(args.join(' '), message.author);
			if(res.loadType != 'NO_MATCHES') {
				if (res.loadType == 'TRACK_LOADED') {
					player.queue.add(res.tracks[0]);
					const parsedDuration = moment.duration(res.tracks[0].length, 'milliseconds').format('mm:ss', { trim: false });
					msg.edit(`**${res.tracks[0].title}** (${parsedDuration}) has been added to the queue by **${res.playlist.tracks.requester}**`);
					if (!player.playing) player.play();
					break;
				}
				else if (res.loadType == 'SEARCH_RESULT') {
					let i = 0;
					const tracks = res.tracks.slice(0, 10);

					const results = res.tracks
						.slice(0, 10)
						.map(result => `**${++i} -** [${result.title}](${result.uri})`)
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
								player.queue.add(track);
							}
							message.channel.send(`**${tracks.length} songs** have been added to the queue by **${tracks[0].requester.tag}**.`);
						}
						else if(entry === 'cancel') {
							message.channel.send('Cancelled selection');
						}
						else {
							const track = tracks[entry - 1];
							player.queue.add(track);
							const parsedDuration2 = moment.duration(track.length, 'milliseconds').format('mm:ss', { trim: false });
							message.channel.send(`**${track.title}** (${parsedDuration2}) has been added to the queue by **${track.requester.tag}**`);
						}
						if (!player.playing) player.play();
					}
					catch (err) {
						message.channel.send('Cancelled selection.');
					}
					break;
				}
				else if (res.loadType == 'PLAYLIST_LOADED') {
					res.playlist.tracks.forEach(track => player.queue.add(track));
					const parsedDuration2 = moment.duration(res.playlist.tracks.reduce((acc, cure) => ({ duration: acc.duration + cure.duration })).duration, 'milliseconds').format('mm:ss', { trim: false });
					msg.edit(`**${res.playlist.info.name}** (${parsedDuration2}) (${res.playlist.tracks.length} tracks) has been added to the queue by **${res.playlist.tracks[0].requester.tag}**`);
					if (!player.playing) player.play();
					break;
				}
				else if(res.loadType == 'LOAD_FAILED') {
					msg.edit('An error occured. Please try again.');
					break;
				}
			}
			else if(i >= 4 && res.loadType != 'PLAYLIST_LOADED') msg.edit('No tracks found.');
		}
	}
};