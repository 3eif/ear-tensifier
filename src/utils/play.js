/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);

module.exports = async (client, message, msg, player, searchQuery, playlist) => {
	// eslint-disable-next-line no-unused-vars
	let failedCount = 0;

	function getRes() {
		client.music.search(searchQuery, message.author).then(async res => {
			return res.loadType;
		}).catch(err => {
			if (playlist) return;
		});
	}

	console.log(getRes());

	while(getRes().loadType == 'NO_MATCHES') {
		if(failedCount > 5) {
			msg.edit('No tracks found. Please try again.');
			break;
		}
		else {
			getRes();
			failedCount++;
		}
	}

	if (getRes().loadType == 'TRACK_LOADED') {
		player.queue.add(getRes().tracks[0]);
		if (!playlist && msg) msg.edit(`**${getRes().tracks[0].title}** (${moment.duration(getRes().tracks[0].duration, 'milliseconds').format('hh:mm:ss', { trim: false })}) has been added to the queue by **${getRes().tracks[0].requester.tag}**`);
		if (!player.playing) player.play();
	}
	else if (getRes().loadType == 'SEARCH_getRes()ULT') {
		player.queue.add(getRes().tracks[0]);
		if (!playlist && msg) msg.edit(`**${getRes().tracks[0].title}** (${moment.duration(getRes().tracks[0].duration, 'milliseconds').format('hh:mm:ss', { trim: false })}) has been added to the queue by **${getRes().tracks[0].requester.tag}**`);
		if (!player.playing) player.play();
	}
	else if (getRes().loadType == 'PLAYLIST_LOADED') {
		for (const track of getRes().playlist.tracks) {
			player.queue.add(track);
			if (!player.playing && player.queue.length == 1) player.play();
		}
		msg.edit(`**${getRes().playlist.info.name}** (${moment.duration(getRes().playlist.tracks.reduce((acc, cure) => ({ duration: acc.duration + cure.duration })).duration, 'milliseconds').format('hh:mm:ss', { trim: false })}) (${getRes().playlist.tracks.length} tracks) has been added to the queue by **${getRes().playlist.tracks[0].requester.tag}**`);
	}
	else if(getRes().loadType == 'LOAD_FAILED') {
		msg.edit('No tracks found. Please try again.');
	}
};