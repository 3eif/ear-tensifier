/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);

module.exports = async (client, message, msg, player, searchQuery, playlist) => {
	// eslint-disable-next-line no-unused-vars
	function play() {
		return new Promise(async function(resolve, reject) {
			client.music.search(searchQuery, message.author).then(async res => {
				if (res.loadType == 'TRACK_LOADED') {
					player.queue.add(res.tracks[0]);
					if (!playlist && msg) msg.edit(`**${res.tracks[0].title}** (${moment.duration(res.tracks[0].duration, 'milliseconds').format('hh:mm:ss', { trim: false })}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
					if (!player.playing) player.play();
					resolve();
				}
				else if (res.loadType == 'SEARCH_RESULT') {
					player.queue.add(res.tracks[0]);
					if (!playlist && msg) msg.edit(`**${res.tracks[0].title}** (${moment.duration(res.tracks[0].duration, 'milliseconds').format('hh:mm:ss', { trim: false })}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
					if (!player.playing) player.play();
					resolve();
				}
				else if (res.loadType == 'PLAYLIST_LOADED') {
					for (const track of res.playlist.tracks) {
						player.queue.add(track);
						if (!player.playing && player.queue.length == 1) player.play();
					}
					msg.edit(`**${res.playlist.info.name}** (${moment.duration(res.playlist.tracks.reduce((acc, cure) => ({ duration: acc.duration + cure.duration })).duration, 'milliseconds').format('hh:mm:ss', { trim: false })}) (${res.playlist.tracks.length} tracks) has been added to the queue by **${res.playlist.tracks[0].requester.tag}**`);
					resolve();
				}
				else if (res.loadType == 'NO_MATCHES') {
					if (res.loadType == 'TRACK_LOADED') {
						player.queue.add(res.tracks[0]);
						if (!playlist && msg) msg.edit(`**${res.tracks[0].title}** (${moment.duration(res.tracks[0].duration, 'milliseconds').format('hh:mm:ss', { trim: false })}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
						if (!player.playing) player.play();
						resolve();
					}
					else if (res.loadType == 'SEARCH_RESULT') {
						player.queue.add(res.tracks[0]);
						if (!playlist && msg) msg.edit(`**${res.tracks[0].title}** (${moment.duration(res.tracks[0].duration, 'milliseconds').format('hh:mm:ss', { trim: false })}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
						if (!player.playing) player.play();
						resolve();
					}
					else if (res.loadType == 'PLAYLIST_LOADED') {
						for (const track of res.playlist.tracks) {
							player.queue.add(track);
							if (!player.playing && player.queue.length == 1) player.play();
						}
						msg.edit(`**${res.playlist.info.name}** (${moment.duration(res.playlist.tracks.reduce((acc, cure) => ({ duration: acc.duration + cure.duration })).duration, 'milliseconds').format('hh:mm:ss', { trim: false })}) (${res.playlist.tracks.length} tracks) has been added to the queue by **${res.playlist.tracks[0].requester.tag}**`);
						resolve();
					}
					else if (res.loadType == 'NO_MATCHES') {
						msg.edit('No tracks found. Please try again.');
					}
					else if (res.loadType == 'LOAD_FAILED') {
						msg.edit('No tracks found. Please try again.');
					}
				}
				else if (res.loadType == 'LOAD_FAILED') {
					msg.edit('No tracks found. Please try again.');
				}
			}).catch(err => {
				if (playlist) return;
				reject();
			});
		});
	}
	play();
};