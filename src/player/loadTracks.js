const ytsr = require('ytsr');

module.exports = async (client, message, msg, player, searchQuery, playlist) => {
    const source = { soundcloud: 'sc' }[searchQuery.source] || 'yt';

    let sq = searchQuery.query || searchQuery;
    if (!/^https?:\/\//.test(sq)) sq = `${source}search:${sq}`;

    async function load(search) {
        const res = await player.manager.search(search);
        if (res.loadType !== 'NO_MATCHES' && res.loadType !== 'LOAD_FAILED') {
            switch (res.loadType) {
                case 'SEARCH_RESULT':
                case 'TRACK_LOADED':
                    player.queue.add([res.tracks[0].track], message.author.id);

                    if (!playlist && msg)
                        await msg.edit('', client.queuedEmbed(
                            res.tracks[0].info.title,
                            res.tracks[0].info.uri,
                            res.tracks[0].info.length,
                            null,
                            message.author,
                        ));

                    break;
                case 'PLAYLIST_LOADED':
                    player.queue.add(res.tracks.map((t) => t.track), message.author.id);

                    await msg.edit('', client.queuedEmbed(
                        res.playlistInfo.name,
                        res.tracks[0].info.uri,
                        res.tracks.reduce((d, t) => d + t.info.length, 0),
                        res.tracks.length,
                        message.author.id,
                    ));
                    break;
            }
            if (!player.playing && !player.paused && !player.msgSent) player.queue.start();
            return;
        }
        else {
            const searchResult = await ytsr(searchQuery, { limit: 1 });
            if(searchResult.results == 0) return msg.edit('No results found.');
            const videoIdentifier = searchResult.items[0].link.replace('https://www.youtube.com/watch?v=', '');
            return load(videoIdentifier);
        }
    }
    return load(sq);
};