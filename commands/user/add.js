const Discord = require("discord.js");
const { main } = require("../../resources/colors.json");
;
const users = require("../../models/user.js");
let { getData, getPreview } = require("spotify-url-info");
const { Utils } = require("erela.js");

module.exports = {
    name: "add",
    description: "Adds a song to the user's favorites.",
    usage: "<user>",
    async execute(client, message, args) {
        const msg = await message.channel.send(`${client.emojiList.loading} Adding song...`);

        let songsToAdd = [];
        if (args[0].startsWith("https://open.spotify.com")) {
            const data = await getData(args.join(" "));
            if (data.type == "playlist" || data.type == "album") {
                if (data.type == "playlist") {
                    for (let i = 0; i < data.tracks.items.length; i++) {
                        let url = `https://open.spotify.com/track/${data.tracks.items[i].track.uri.split("spotify:track:")[1]}`
                        songsToAdd.push(url)
                    }
                    const delay = ms => new Promise(res => setTimeout(res, ms));
                    await delay(4000);
                    addToDB();
                } else {
                    await data.tracks.items.forEach(song => {
                        songsToAdd.push(song.uri)
                    }).then(addToDB());
                }
                let playlistInfo = await getPreview(args.join(" "));
                msg.edit(`Added ${data.tracks.items.length} songs from **${playlistInfo.title}** to your favorites!`)
            } else if (data.type == "track") {
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
                        songsToAdd.push(res.tracks[0].uri)
                        addToDB();
                        return msg.edit(`Added **${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) to your favorites.`)
                        break;

                    case "SEARCH_RESULT":
                        songsToAdd.push(res.tracks[0].uri)
                        addToDB();
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

        async function addToDB() {
            users.findOne({
                authorID: message.author.id
            }, async (err, u) => {
                if (err) console.log(err);
                if (!u) {
                    const newUser = new profiles({
                        authorID: message.author.id,
                        authorName: message.author.tag,
                        bio: "",
                        songsPlayed: 0,
                        commandsUsed: 0,
                        blocked: false,
                        supporter: false,
                        supporterPlus: false,
                        supporterPlusPlus: false,
                        supporterInfinite: false,
                        developer: false,
                        favorites: [],
                    });
                    newUser.save().catch(e => console.log(e));
                }
                let currentFavorites = u.favorites;
                u.favorites = currentFavorites.concat(songsToAdd);
                await u.save().catch(e => console.log(e));
            });
        }
    },
};