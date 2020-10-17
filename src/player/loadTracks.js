const ytsr = require('ytsr');

module.exports = async (client, message, msg, player, searchQuery, playlist) => {
	let tries = 0;
	async function load(search) {
		const res = await client.music.search(search, message.author);
		if (res.loadType !== 'NO_MATCHES' && res.loadType !== 'LOAD_FAILED') {
            if(res.loadType == 'TRACK_LOADED' || res.loadType == 'SEARCH_RESULT') {
				player.queue.add(res.tracks[0]);
				if (!playlist && msg) msg.edit('', client.queuedEmbed(
					res.tracks[0].title,
					res.tracks[0].uri,
					res.tracks[0].duration,
					null,
					res.tracks[0].requester,
				));
				if (!player.playing && !player.paused && !player.queue.length) player.play();
			}
			else if (res.loadType == 'PLAYLIST_LOADED') {

				for (const track of res.playlist.tracks) {
					player.queue.add(track);
					if (!player.playing && !player.paused && !player.queue.length) player.play();
				}
				msg.edit('', client.queuedEmbed(
					res.playlist.info.name,
					res.playlist.info.uri,
					res.playlist.tracks.reduce((acc, cure) => ({
						duration: acc.duration + cure.duration,
					})).duration,
					res.playlist.tracks.length,
					res.playlist.tracks[0].requester.id,
				));
			}
            return;
		}
        else {
            const searchResult = await ytsr(searchQuery, { limit: 1 });
            if(tries > 7) return msg.edit('No results found.');
            else {
				tries++;
				return load(searchResult.items[0].link);
			}
        }
	}
	return load(searchQuery);
};