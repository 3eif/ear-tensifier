const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");

const mongoose = require("mongoose");
const bot = require("../models/bot.js");
const { mongoUsername, mongoPass } = require("../tokens.json");

mongoose.connect(`mongodb+srv://${mongoUsername}:${mongoPass}@tetracyl-unhxi.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = {
    name: "play",
    description: "Plays a song",
    args: true,
    usage: "<song>",
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

        client.music.search(args.join(" "), message.author).then(async res => {
            switch (res.loadType) {

                case "TRACK_LOADED":
                    player.queue.add(res.tracks[0]);
                    msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
                    if (!player.playing) player.play();
                    break;

                case "SEARCH_RESULT":
                    player.queue.add(res.tracks[0]);
                    msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.tracks[0].requester.tag}**`);
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
        }).catch(err => message.channel.send(err.message))
    },
};