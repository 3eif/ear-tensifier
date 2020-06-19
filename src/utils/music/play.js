/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */


module.exports = async (client, message, msg, player, searchQuery, playlist) => {
	const tries = 5;
	for(let i = 0; i < tries; i++) {
		const res = await client.music.search(searchQuery, message.author);
		if(res.loadType != 'NO_MATCHES') {
			if (res.loadType == 'TRACK_LOADED') {
				player.queue.add(res.tracks[0]);
				if (!playlist && msg) msg.edit(`**${res.tracks[0].title}** [${client.formatDuration(res.tracks[0].length)}] has been added to the queue by **${res.tracks[0].requester.tag}**`);
				if (!player.playing && !player.paused && !player.queue.length) player.play();
				break;
			}
			else if (res.loadType == 'SEARCH_RESULT') {
				player.queue.add(res.tracks[0]);
				if (!playlist && msg) msg.edit(`**${res.tracks[0].title}** [${client.formatDuration(res.tracks[0].length)}] has been added to the queue by **${res.tracks[0].requester.tag}**`);
				if (!player.playing && !player.paused && !player.queue.length) player.play();
				break;
			}
			else if (res.loadType == 'PLAYLIST_LOADED') {
				return msg.edit('Playlists are temporarily disabled');
				for (const track of res.playlist.tracks) {
					player.queue.add(track);
					if (!player.playing && !player.paused && !player.queue.length) player.play();
				}
				msg.edit(`**${res.playlist.info.name}** [${client.formatDuration(res.playlist.tracks.reduce((acc, cure) => ({ duration: acc.length + cure.length })).duration)}] (${res.playlist.tracks.length} tracks) has been added to the queue by **${res.playlist.tracks[0].requester.tag}**`);
				break;
			}
			else if(res.loadType == 'LOAD_FAILED') {
				msg.edit('An error occured. Please try again.');
				break;
			}
		}
		else if(i >= 4 && !playlist) msg.edit('No tracks found.');
	}
};