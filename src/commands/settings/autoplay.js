const Command = require('../../structures/Command');

const users = require('../../models/user.js');
const { getData, getPreview } = require('spotify-url-info');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);

module.exports = class AutoPlay extends Command {
	constructor(client) {
		super(client, {
			name: 'autoplay',
			description: 'Configures autoplay feature.',
			usage: '<search query/link>',
			args: true,
			cooldown: 5,
			permission: 'pro',
		});
	}
	async run(client, message, args) {
		const msg = await message.channel.send(`${client.emojiList.loading} Configuring autoplay (This might take a few seconds)...`);

		const songsToAdd = [];
		let dataLength = 0;
		let playlistMessage = '';

		if (args[0].startsWith(client.settings.spotifyURL)) {
			const data = await getData(args.join(' '));
			if (data.type == 'playlist' || data.type == 'album') {
				if (data.type == 'playlist') {
					dataLength = data.tracks.items.length;
					for (let i = 0; i < data.tracks.items.length; i++) {
						const song = data.tracks.items[i];
						search(`${song.track.name} ${song.track.artists[0].name}`, 'yes');
					}
				}
				else {
					dataLength = data.tracks.items.length;
					await data.tracks.items.forEach(song => {
						search(`${song.name} ${song.artists[0].name}`, 'yes');
					});
				}
				const playlistInfo = await getPreview(args.join(' '));
				playlistMessage = `Set ${data.tracks.items.length} songs from **${playlistInfo.title}** to autoplay!`;
			}
			else if (data.type == 'track') {
				const track = await getPreview(args.join(' '));
				await search(`${track.title} ${track.artist}`, 'no');
			}
		}
		else await search(args.join(' '), 'no');

		async function search(sq, isPlaylist) {
			let searchQuery = sq;
			if (['youtube', 'soundcloud', 'bandcamp', 'mixer', 'twitch'].includes(args[0].toLowerCase())) {
				searchQuery = {
					source: args[0],
					query: args.slice(1).join(' '),
				};
			}

			client.manager.search(searchQuery, message.author).then(async res => {
				switch (res.loadType) {
					case 'TRACK_LOADED':
						songsToAdd.push(res.tracks[0]);
						if (isPlaylist == 'no') {
							const parsedDuration = moment.duration(res.tracks[0].duration, 'milliseconds').format('hh:mm:ss', { trim: false });
							msg.edit(`Set **${res.tracks[0].title}** (${parsedDuration}) to autoplay.`);
							return await addToDB(false);
						}
						await addToDB(true);
						break;

					case 'SEARCH_RESULT':
						songsToAdd.push(res.tracks[0]);
						if (isPlaylist == 'no') {
							const parsedDuration = moment.duration(res.tracks[0].duration, 'milliseconds').format('hh:mm:ss', { trim: false });
							msg.edit(`Set **${res.tracks[0].title}** (${parsedDuration}) to autoplay.`);
							return await addToDB(false);
						}
						await addToDB(true);
						break;

					case 'PLAYLIST_LOADED':
						res.playlist.tracks.forEach(track => songsToAdd.push(track));
						// eslint-disable-next-line no-case-declarations
						const parsedDuration = moment.duration(res.playlist.tracks.reduce((acc, cure) => ({ duration: acc.duration + cure.duration })).duration, true, 'milliseconds').format('hh:mm:ss', { trim: false });
						msg.edit(`Set **${res.playlist.info.name}** (${parsedDuration}}) (${res.playlist.tracks.length} tracks) to autoplay.`);
						await addToDB(false);
						break;
				}
				return;
			}).catch(() => {
				search(searchQuery, isPlaylist);
			});
		}

		async function addToDB(playlist) {
			if (playlist) {
				if (songsToAdd.length != dataLength) return;
			}
			users.findOne({
				authorID: message.author.id,
			}, async (err, u) => {
				if (err) client.log(err);
				u.autoplay = songsToAdd;
				if (playlist) msg.edit(playlistMessage);
				await u.save().catch(e => client.log(e));
			});
		}
	}
};