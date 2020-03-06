const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");

const bot = require("../models/bot.js");
const users = require("../models/user.js");
const songs = require("../models/song.js");
const premium = require('../util/premium.js');

let { getData, getPreview } = require("spotify-url-info");

module.exports = {
    name: "play",
    description: "Plays a song",
    args: true,
    usage: "<song>",
    aliases: ["p"],
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;;
        if (!voiceChannel) return message.channel.send("You need to be in a voice channel to play music");

        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has("CONNECT")) return message.channel.send("I do not have permission to join your voice channel.");
        if (!permissions.has("SPEAK")) return message.channel.send("I do not have permission to speak in your voice channel.");

        const player = client.music.players.spawn({
            guild: message.guild,
            textChannel: message.channel,
            voiceChannel: voiceChannel
        });

        if (player.pause == "paused") return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);

        const msg = await message.channel.send(`${emojis.cd}  Searching for \`${args.join(" ")}\`...`)

        bot.findOne({
            clientID: client.user.id
        }, async (err, b) => {
            if (err) console.log(err);

            b.songsPlayed += 1;
            await b.save().catch(e => console.log(e));
        });

        users.findOne({
            authorID: message.author.id
        }, async (err, u) => {
            if (err) console.log(err);

            u.songsPlayed += 1;
            await u.save().catch(e => console.log(e));
        });

        let searchQuery;
        if (args[0].startsWith("https://open.spotify.com")) {
            const data = await getData(args.join(" "));
            if (data.type == "playlist" || data.type == "album") {
                await data.tracks.items.forEach(song => {
                    play(`${song.track.name} ${song.track.artists[0].name}`, true);
                });
                let playlistInfo = await getPreview(args.join(" "));
                msg.edit(`**${playlistInfo.title}** (${data.tracks.items.length} tracks) has been added to the queue by **${message.author.tag}**`)
            } else if (data.type == "track") {

            }
        } else {
            searchQuery = args.join(" ")
            play(searchQuery, false);
        }

        async function play(searchQuery, playlist) {
            client.music.search(searchQuery, message.author).then(async res => {
                switch (res.loadType) {
                    case "TRACK_LOADED":
                        if(!premium(message.author.id, "Supporter") && res.tracks[0].duration > 18000000) return msg.edit(`Only **Premium** users can play songs longer than 5 hours. Click here to get premium: https://www.patreon.com/join/eartensifier`)
                        player.queue.add(res.tracks[0]);
                        if (!playlist) msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
                        if (!player.playing) player.play();
                        addDB(res.tracks[0].uri.split("v=")[1], res.tracks[0].title, res.tracks[0].author, res.tracks[0].duration)
                        break;

                    case "SEARCH_RESULT":
                        if(!premium(message.author.id, "Supporter") && res.tracks[0].duration > 18000000) return msg.edit(`Only **Premium** users can play songs longer than 5 hours. Click here to get premium: https://www.patreon.com/join/eartensifier`)
                        player.queue.add(res.tracks[0]);
                        if (!playlist) msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
                        if (!player.playing) player.play();
                        addDB(res.tracks[0].uri.split("v=")[1], res.tracks[0].title, res.tracks[0].author, res.tracks[0].duration)
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

        function addDB(videoID, title, author, duration) {
            // songs.findOne({
            //     songID: videoID,
            // }, async (err, s) => {
            //     if (err) console.log(err);
            //     if (!s) {
            //         const newSong = new songs({
            //             songName: title,
            //             songAuthor: author,
            //             songDuration: duration,
            //             timesPlayed: 0,
            //             timesAdded: 0,
            //         });
            //         await newSong.save().catch(e => console.log(e));
            //     }
            //     s.timesPlayed += 1;
            //     await s.save().catch(e => console.log(e));
            // });
        }
    },
};