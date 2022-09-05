const { Track: { TrackPlaylist } } = require('yasha');

const Command = require('../../structures/Command');
const QueueHelper = require('../../helpers/QueueHelper');
const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = class Play extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			description: {
				content: 'Plays a song or playlist (defaults to YouTube).',
				usage: '<search query>',
				examples: [
					'resonance',
					'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
					'https://open.spotify.com/track/5hVghJ4KaYES3BFUATCYn0?si=44452e03da534c75',
					'sc resonance',
				],
			},
			aliases: ['p', 'tocar'],
			args: true,
			acceptsAttachments: false,
			voiceRequirements: {
				isInVoiceChannel: true,
				isInSameVoiceChannel: true,
			},
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: 'query',
					type: ApplicationCommandOptionType.String,
					required: true,
					description: 'The query to search for.',
					autocomplete: true,
				},
			],
			permissions: {
				botPermissions: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],
			},
			slashCommand: true,
			contextMenu: {
				name: 'Play',
				type: ApplicationCommandType.Message,
			},
		});
	}

	async run(client, ctx, args) {
		let query;
		let source;
		if (ctx.contextMenuContent) {
			query = ctx.contextMenuContent;
		}
		else if (args[0]) {
			query = args.slice(0).join(' ');
			if (args[0].toLowerCase() === 'soundcloud' || args[0].toLowerCase() === 'sc') {
				query = args.slice(1).join(' ');
				source = 'soundcloud';
			}
			else if (args[0].toLowerCase() === 'spotify' || args[0].toLowerCase() === 'sp') {
				query = args.slice(1).join(' ');
				source = 'spotify';
			}
			else if (args[0].toLowerCase() === 'youtube' || args[0].toLowerCase() === 'yt') {
				query = args.slice(1).join(' ');
				source = 'youtube';
			}
			else if (args[0].toLowerCase() === 'applemusic' || args[0].toLowerCase() === 'apple') {
				query = args.slice(1).join(' ');
				source = 'apple';
			}
		}

		await ctx.sendDeferMessage(`${client.config.emojis.typing} Searching for \`${query}\`...`);

		let player = client.music.players.get(ctx.guild.id);
		if (!player) {
			player = await client.music.newPlayer(ctx.guild, ctx.member.voice.channel, ctx.channel);
			player.connect();
		}

		if (player.queue.length > client.config.max.songsInQueue) return ctx.editMessage(`You have reached the **maximum** amount of songs (${client.config.max.songsInQueue})`);

		let result;
		try {
			result = await client.music.search(query, ctx.author, source);
		}
		catch (error) {
			if (query.includes('cdn') || query.includes('media') || query.includes('discord.com') || query.includes('.mp4') || query.includes('.mp3') || query.includes('.mp3')) return ctx.editMessage('No results found. Use the file command if you want to play a file track.');
			else return ctx.editMessage('No results found.');
		}

		if (result instanceof TrackPlaylist) {
			let res = result;
			const firstTrack = res.first_track;
			let list = [];

			if (firstTrack) list.push(firstTrack);

			while (res && res.length) {
				if (firstTrack) {
					for (let i = 0; i < res.length; i++) {
						if (res[i].equals(firstTrack)) {
							res.splice(i, 1);
							break;
						}
					}
				}
				list = list.concat(res);
				try {
					res = await res.next();
				}
				catch (e) {
					client.logger.error(e);
					throw e;
				}
			}

			if (list.length) {
				for (const track of list) {
					if (!track.requester) track.requester = ctx.author;
					player.queue.add(track);
				}
			}

			const totalDuration = list.reduce((acc, cur) => acc + cur.duration, 0);

			if (!player.playing && !player.paused) player.play();
			return ctx.editMessage({ content: null, embeds: [QueueHelper.queuedEmbed(result.title, result.url, totalDuration, list.length, ctx.author, client.config.colors.default)] });
		}

		// console.log(result);
		// if (result.streams.isLive) return ctx.editMessage(client.config.emojis.failure + ' Live stream playback is currently not supported.');

		player.queue.add(result);
		if (!player.playing && !player.paused) player.play();

		ctx.editMessage({ content: null, embeds: [QueueHelper.queuedEmbed(result.title, result.url, result.duration, null, ctx.author, client.config.colors.default)] });
	}
};
