/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */


module.exports = async (client, message, msg, player, searchQuery, playlist) => {
    const tries = 5;
    const source = { soundcloud: "sc" }[searchQuery.source] || "yt";

    let search = searchQuery.query || searchQuery;
    if (!/^https?:\/\//.test(search)) search = `${source}search:${search}`;

    async function load() {
        const res = await player.manager.search(search);

        if (res.loadType !== "NO_MATCHES") {
            switch (res.loadType) {
                case "SEARCH_RESULT":
                case "TRACK_LOADED":
                    player.queue.add([res.tracks[0].track], message.author.id);

                    if (!playlist && msg)
                        await msg.edit('', client.queuedEmbed(
                            res.tracks[0].info.title,
                            res.tracks[0].info.uri,
                            res.tracks[0].info.length,
                            null,
                            message.author
                        ));

                    break;
                case "LOAD_FAILED":
                    return msg.edit('An error occurred. Please try again.');
                case "PLAYLIST_LOADED":
                    player.queue.add(res.tracks.map((t) => t.track), message.author.id);

                    await msg.edit('', client.queuedEmbed(
                        res.playlistInfo.name,
                        res.tracks[0].info.uri,
                        res.tracks.reduce((d, t) => d + t.info.length, 0),
                        res.tracks.length,
                        message.author.id
                    ));

                    break;
            }

            if (!player.playing && !player.paused) player.queue.start();
            return;
        } else if (i >= 4 && !playlist) {
            msg.edit('No tracks found.');
        }

        return load();
    }

    return load();
}