const premium = require('../utils/premium/premium.js');
const { Utils } = require("erela.js");

module.exports = async (client, message, msg, player, searchQuery, playlist) => {
    let search = new Promise(async function (resolve, reject) {
        client.music.search(searchQuery, message.author).then(async res => {
            switch (res.loadType) {
                case "TRACK_LOADED":
                    player.queue.add(res.tracks[0]);
                    if (!playlist && msg) msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
                    if (!player.playing) player.play();
                    resolve();
                    break;

                case "SEARCH_RESULT":
                    player.queue.add(res.tracks[0]);
                    if (!playlist && msg) msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
                    if (!player.playing) player.play();
                    resolve();
                    break;

                case "PLAYLIST_LOADED":
                    // res.playlist.tracks.forEach(track => player.queue.add(track));
                    // const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cure) => ({ duration: acc.duration + cure.duration })).duration, true);
                    // msg.edit(`**${res.playlist.info.name}** (${duration}) (${res.playlist.tracks.length} tracks) has been added to the queue by **${res.playlist.tracks.requester}**`);
                    // if (!player.playing) player.play()
                    msg.edit("Playlist functionality is currently disabled. Please try again later.")
                    reject();
                    break;

            }
            return;
        }).catch(err => {
            if (playlist) return;
            reject();
            msg.edit(err.message)
        })
    })
}