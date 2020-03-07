const Discord = require("discord.js");
const emojis = require("../../recourses/emojis.json");
const colors = require("../../recourses/colors.json");
const { Utils } = require("erela.js");

const bot = require("../../models/bot.js");
const users = require("../../models/user.js");
const songs = require("../../models/song.js");
const premium = require('../../utils/premium.js');

module.exports = {
    name: "twitch",
    description: "Plays a stream from Twitch.",
    args: true,
    usage: "<stream link>",
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

        let searchQuery = args.join(" ")
        searchQuery = {
            source: "twitch",
            query: args.slice(0).join(" ")
        }
        play(searchQuery, false);
    
        async function play(searchQuery, playlist) {
            client.music.search(searchQuery, message.author).then(async res => {
                switch (res.loadType) {
                    case "TRACK_LOADED":
                        if(!premium(message.author.id, "Supporter") && res.tracks[0].duration > 18000000) return msg.edit(`Only **Premium** users can play songs longer than 5 hours. Click here to get premium: https://www.patreon.com/join/eartensifier`)
                        player.queue.add(res.tracks[0]);
                        if (!playlist) msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
                        if (!player.playing) player.play();
                        break;

                    case "SEARCH_RESULT":
                        if(!premium(message.author.id, "Supporter") && res.tracks[0].duration > 18000000) return msg.edit(`Only **Premium** users can play songs longer than 5 hours. Click here to get premium: https://www.patreon.com/join/eartensifier`)
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
    },
};