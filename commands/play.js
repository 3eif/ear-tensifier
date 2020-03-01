const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");

const mongoose = require("mongoose");
const bot = require("../models/bot.js");
const users = require("../models/user.js");

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

        const msg = await message.channel.send(`${emojis.cd}  Searching for ${args.join(" ")}...`)

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
                }),
                message.channel.send(`**${data.title}** (${data.tracks.items.length} tracks) has been added to the queue by **${message.author}**`)
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
                        player.queue.add(res.tracks[0]);
                        if (!playlist) msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
                        if (!player.playing) player.play();
                        break;

                    case "SEARCH_RESULT":
                        player.queue.add(res.tracks[0]);
                        if (!playlist) msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
                        if (!player.playing) player.play();
                        break;

                    case "PLAYLIST_LOADED":
                        // res.playlist.tracks.forEach(track => player.queue.add(track));
                        // const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cure) => ({ duration: acc.duration + cure.duration })).duration, true);
                        // msg.edit(`**${res.playlist.info.name}** (${duration}) (${res.playlist.tracks.length} tracks) has been added to the queue by **${res.playlist.tracks.requester}**`);
                        // if (!player.playing) player.play()
                        return message.channel.send("Playlist functionality is currently disabled. Please try again later.")
                        break;
                    
                }
                return;
            }).catch(err => { 
                if (playlist) return;
                message.channel.send(err.message) 
            })
        }
    },
};