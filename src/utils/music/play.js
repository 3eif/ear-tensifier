/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */


module.exports = async (client, message, msg, player, searchQuery, playlist) => {
	const tries = 5;
	const res = await player.manager.search(`ytsearch:${searchQuery}`);
	const { track, info } = res.tracks[0];
	await player.play(track);


	for (let i = 0; i < tries; i++) {
		// message.channel.send(res);
		// if (res.loadType != 'NO_MATCHES') {
		// 	if (res.loadType == 'TRACK_LOADED') {
		// 		player.queue.add(res.tracks[0]);
		// 		if (!playlist && msg) msg.edit('', client.queuedEmbed(
		// 			res.tracks[0].title,
		// 			res.tracks[0].uri,
		// 			res.tracks[0].duration,
		// 			null,
		// 			res.tracks[0].requester,
		// 		));
		// 		if (!player.playing && !player.paused && !player.queue.length) player.play();
		// 		break;
		// 	}
		// 	else if (res.loadType == 'SEARCH_RESULT') {
		// 		player.queue.add(res.tracks[0]);
		// 		if (!playlist && msg) {
		// 			msg.edit('', client.queuedEmbed(
		// 				res.tracks[0].title,
		// 				res.tracks[0].uri,
		// 				res.tracks[0].duration,
		// 				null,
		// 				res.tracks[0].requester,
		// 			));
		// 		}
		// 		if (!player.playing && !player.paused && !player.queue.length) player.play();
		// 		break;
		// 	}
		// 	else if (res.loadType == 'PLAYLIST_LOADED') {

		// 		for (const track of res.playlist.tracks) {
		// 			player.queue.add(track);
		// 			if (!player.playing && !player.paused && !player.queue.length) player.play();
		// 		}
		// 		msg.edit('', client.queuedEmbed(
		// 			res.playlist.info.name,
		// 			res.playlist.info.uri,
		// 			res.playlist.tracks.reduce((acc, cure) => ({
		// 				duration: acc.duration + cure.duration,
		// 			})).duration,
		// 			res.playlist.tracks.length,
		// 			res.playlist.tracks[0].requester.id,
		// 		));
		// 		break;
		// 	}
		// 	else if (res.loadType == 'LOAD_FAILED') {
		// 		msg.edit('An error occured. Please try again.');
		// 		break;
		// 	}
		// }
		// else if (i >= 4 && !playlist) msg.edit('No tracks found.');
	}
};