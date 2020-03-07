const premium = require('../utils/premium.js');
const { Utils } = require("erela.js");

module.exports = async(client, message, msg, player, searchQuery, playlist) => {
    client.music.search(searchQuery, message.author).then(async res => {
        switch (res.loadType) {
            case "TRACK_LOADED":
                if (!premium(message.author.id, "Supporter") && res.tracks[0].duration > 18000000) return msg.edit(`Only **Premium** users can play songs longer than 5 hours. Click here to get premium: https://www.patreon.com/join/eartensifier`)
                player.queue.add(res.tracks[0]);
                if (!playlist) msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
                if (!player.playing) player.play();
                break;

            case "SEARCH_RESULT":
                if (!premium(message.author.id, "Supporter") && res.tracks[0].duration > 18000000) return msg.edit(`Only **Premium** users can play songs longer than 5 hours. Click here to get premium: https://www.patreon.com/join/eartensifier`)
                player.queue.add(res.tracks[0]);
                if (!playlist) msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
                if (!player.playing) player.play();
                break;

            case "PLAYLIST_LOADED":
                // res.playlist.tracks.forEach(track => player.queue.add(track));
                // const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cure) => ({ duration: acc.duration + cure.duration })).duration, true);
                // msg.edit(`**${res.playlist.info.name}** (${duration}) (${res.playlist.tracks.length} tracks) has been added to the queue by **${res.playlist.tracks.requester}**`);
                // if (!player.playing) player.play()
                return msg.edit("Playlist functionality is currently disabled. Please try again later.")
                break;

        }
        return;
    }).catch(err => {
        if (playlist) return;
        msg.edit(err.message)
    })
}