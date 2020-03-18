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
        let dataLength = 0;

        if (args[0].startsWith("https://open.spotify.com")) {
            const data = await getData(args.join(" "));
            if (data.type == "playlist" || data.type == "album") {
                if (data.type == "playlist") {
                    dataLength = data.tracks.items.length;
                    for(let i = 0; i < data.tracks.items.length; i++){
                        let song = data.tracks.items[i];
                        search(`${song.track.name} ${song.track.artists[0].name}`, "yes");
                    }
                } else {
                    dataLength = data.tracks.items.length;
                    await data.tracks.items.forEach(song => {
                        search(`${song.name} ${song.artists[0].name}`, "yes");
                    });
                }
                let playlistInfo = await getPreview(args.join(" "));
                msg.edit(`Added ${data.tracks.items.length} songs from **${playlistInfo.title}** to your favorites!`)
            } else if (data.type == "track") {
                const track = await getPreview(args.join(" "))
                search(`${track.title} ${track.artist}`, "no")
            }
        } else {
            search(args.join(" "), "no");
        }

        async function search(sq, isPlaylist) {
            let searchQuery = sq;
            if (["youtube", "soundcloud", "bandcamp", "mixer", "twitch"].includes(args[0].toLowerCase())) {
                searchQuery = {
                    source: args[0],
                    query: args.slice(1).join(" ")
                }
            }

            client.music.search(searchQuery, message.author).then(async res => {
                let obj = {};
                switch (res.loadType) {
                    case "TRACK_LOADED":
                        obj = {
                            title: res.tracks[0].title,
                            author: res.tracks[0].author,
                            duration: res.tracks[0].duration,
                            url: res.tracks[0].uri,
                        };
                        songsToAdd.push(obj);
                        if (isPlaylist == "no") {
                            msg.edit(`Added **${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) to your favorites.`)
                            return await addToDB(false);
                        }
                        await addToDB(true);
                        break;

                    case "SEARCH_RESULT":
                        obj = {
                            title: res.tracks[0].title,
                            author: res.tracks[0].author,
                            duration: res.tracks[0].duration,
                            url: res.tracks[0].uri,
                        };
                        songsToAdd.push(obj);
                        if (isPlaylist == "no") {
                            msg.edit(`Added **${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) to your favorites.`);
                            return await addToDB(false);
                        }
                        await addToDB(true);
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

        async function addToDB(playlist) {
            if(playlist){
                console.log(`${songsToAdd.length} = ${dataLength-1}`);
                if(songsToAdd.length != dataLength-1) return;
            }
            users.findOne({
                authorID: message.author.id
            }, async (err, u) => {
                if (err) console.log(err);
                let currentFavorites = u.favorites;
                u.favorites = currentFavorites.concat(songsToAdd);
                await u.save().catch(e => console.log(e));
            });
        }
    },
};