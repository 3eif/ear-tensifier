const premium = require('../../utils/premium/premium.js');
const users = require("../../models/user.js");
let { getData, getPreview } = require("spotify-url-info");
const { Utils } = require("erela.js");

module.exports = {
    name: "add",
    description: "Adds a song to the user's favorites.",
    usage: "<user>",
    cooldown: 5,
    async execute(client, message, args) {
        const msg = await message.channel.send(`${client.emojiList.loading} Adding song(s)...`);

        let songsToAdd = [];
        let totalFavs = 0;

        users.findOne({
            authorID: message.author.id
        }, async (err, u) => {
            if (err) console.log(err);
            if (await premium(message.author.id, "Premium") == false) {
                if (u.favorites + 1 > 10) return msg.edit(`You have reached your maximum amount of favorite songs (10 songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
            } else if (await premium(message.author.id, "Premium") == true && await premium(message.author.id, "Pro") == false) {
                if (u.favorites + 1 > 25) return msg.edit(`You have reached your maximum amount of favorite songs (25 songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
            } else if (await premium(message.author.id, "Pro") == true) {
                if (u.favorites + 1 > 50) return msg.edit(`You have reached your maximum amount of favorite songs (50 songs).`);
            }
            if (args[0].startsWith("https://open.spotify.com")) {
                const data = await getData(args.join(" "));
                if (data.type == "playlist" || data.type == "album") {
                    if (data.type == "playlist") {
                        for (let i = 0; i < data.tracks.items.length; i++) {
                            if (await premium(message.author.id, "Premium") == false) {
                                if (totalFavs + songsToAdd.length > 10) return msg.edit(`You have reached your maximum amount of favorite songs (10 songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
                            } else if (await premium(message.author.id, "Premium") == true && await premium(message.author.id, "Pro") == false) {
                                if (totalFavs + songsToAdd.length > 25) return msg.edit(`You have reached your maximum amount of favorite songs (25 songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
                            } else if (await premium(message.author.id, "Pro") == true) {
                                if (totalFavs + songsToAdd.length > 50) return msg.edit(`You have reached your maximum amount of favorite songs (50 songs).`);
                            }
                            let url = `https://open.spotify.com/track/${data.tracks.items[i].track.uri.split("spotify:track:")[1]}`
                            songsToAdd.push(url)
                        }
                        const delay = ms => new Promise(res => setTimeout(res, ms));
                        await delay(4000);
                        addToDB();
                    } else {
                        let content = new Promise(async function (resolve, reject) {
                            let pushShongs = await data.tracks.items.forEach(song => {
                                if (premium(message.author.id, "Premium") == false) {
                                    if (totalFavs + songsToAdd.length > 10) return msg.edit(`You have reached your maximum amount of favorite songs (10 songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
                                } else if (premium(message.author.id, "Premium") == true && premium(message.author.id, "Pro") == false) {
                                    if (totalFavs + songsToAdd.length > 25) return msg.edit(`You have reached your maximum amount of favorite songs (25 songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
                                } else if (premium(message.author.id, "Pro") == true) {
                                    if (totalFavs + songsToAdd.length > 50) return msg.edit(`You have reached your maximum amount of favorite songs (50 songs).`);
                                }
                                let url = `https://open.spotify.com/track/${song.uri.split("spotify:track:")[1]}`
                                songsToAdd.push(song.uri)
                            })
                            if (data.tracks.items.length == songsToAdd.length) resolve()
                        });
                        content.then(addToDB());
                    }
                    let playlistInfo = await getPreview(args.join(" "));
                    msg.edit(`Added ${data.tracks.items.length} songs from **${playlistInfo.title}** to your favorites!`)
                } else if (data.type == "track") {
                    if (await premium(message.author.id, "Premium") == false) {
                        if (totalFavs + 1 > 10) return msg.edit(`You have reached your maximum amount of favorite songs (10 songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
                    } else if (await premium(message.author.id, "Premium") == true && await premium(message.author.id, "Pro") == false) {
                        if (totalFavs + 1 > 25) return msg.edit(`You have reached your maximum amount of favorite songs (25 songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
                    } else if (await premium(message.author.id, "Pro") == true) {
                        if (totalFavs + 1 > 50) return msg.edit(`You have reached your maximum amount of favorite songs (50 songs).`);
                    }
                    const track = await getPreview(args.join(" "))
                    songsToAdd.push(track.uri);
                }
            } else {
                let searchQuery = args.join(" ")
                if (["youtube", "soundcloud", "bandcamp", "mixer", "twitch"].includes(args[0].toLowerCase())) {
                    searchQuery = {
                        source: args[0],
                        query: args.slice(1).join(" ")
                    }
                }

                client.music.search(searchQuery, message.author).then(async res => {
                    switch (res.loadType) {
                        case "TRACK_LOADED":
                            songsToAdd.push(`${res.tracks[0].uri}`)
                            await addToDB();
                            return msg.edit(`Added **${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) to your favorites.`)
                            break;

                        case "SEARCH_RESULT":

                            songsToAdd.push(`${res.tracks[0].uri}`)
                            await addToDB();
                            return msg.edit(`Added **${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) to your favorites.`)
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
                });
            }

        });

        async function addToDB() {
            users.findOne({
                authorID: message.author.id
            }, async (err, u) => {
                if (err) console.log(err);
                let currentFavorites = u.favorites;
                let totalFavorites = currentFavorites.length + songsToAdd.length;
                if (await premium(message.author.id, "Premium") == false) {
                    if (totalFavorites > 10) return msg.edit(`You have reached your maximum amount of favorite songs (10 songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
                } else if (await premium(message.author.id, "Premium") == true && await premium(message.author.id, "Pro") == false) {
                    if (totalFavorites > 25) return msg.edit(`You have reached your maximum amount of favorite songs (25 songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`);
                } else if (await premium(message.author.id, "Pro") == true) {
                    if (totalFavorites > 50) return msg.edit(`You have reached your maximum amount of favorite songs (50 songs).`);
                }
                u.favorites = currentFavorites.concat(songsToAdd);
                await u.save().catch(e => console.log(e));
            });
        }
    },
};