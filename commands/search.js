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
    name: "search",
    description: "Provides a variety of search results for a song.",
    usage: "<song>",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;;
        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to play music");

        const permissions = voiceChannel.permissionsFor(client.user);
        if(!permissions.has("CONNECT")) return message.channel.send("I do not have permission to join your voice channel.");
        if(!permissions.has("SPEAK")) return message.channel.send("I do not have permission to speak in your voice channel.");

        const msg = await message.channel.send(`${emojis.cd}  Searching for ${args.join(" ")}...`)

        bot.findOne({
            clientID: client.user.id
        }, async (err, b) => {
            if (err) console.log(err);

            b.songsPlayed += 1;
            await b.save().catch(e => console.log(e));
        });

        const player = client.music.players.spawn({
            guild: message.guild,
            textChannel: message.channel,
            voiceChannel: voiceChannel
        });

        client.music.search(args.join(" "), message.author).then(async res => {
            switch(res.loadType){
                case "TRACK_LOADED" :
                    player.queue.add(res.tracks[0]);
                    msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.playlist.tracks.requester}**`);
                    if(!player.playing) player.play();
                    break;
                case "SEARCH_RESULT" :
                    let index = 1;
                    const tracks = res.tracks.slice(0, 5);
                    const embed = new Discord.MessageEmbed()
                        .setAuthor("Song Selection", message.author.displayAvatarURL)
                        .setDescription(tracks.map(video => `**${index++} -** ${video.title}`))
                        .setFooter("Your response time closes within the next 10 seconds.");
                    await msg.edit("", embed);

                    const collector = message.channel.createMessageCollector(m => {
                        return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel])$`, "i").test(m.content);
                    }, {time: 10000, max: 1});

                    collector.on("collect", m => {
                        if(/cancel/i.test(m.content)) return collector.stop("cancelled");

                        const track = tracks[Number(m.content) - 1];
                        player.queue.add(track);
                        message.channel.send(`**${tracks[m.content - 1].title}** (${Utils.formatTime(tracks[m.content - 1].duration, true)}) has been added to the queue by **${track.requester.tag}**`);
                        if(!player.playing) player.play();
                    });

                    collector.on("end", (_, reason) => {
                        if(["time", "canceled"].includes(reason)) return message.channel.send("Cancelled selection.")
                    });
                    break;

                case "PLAYLIST_LOADED" :
                    // res.playlist.tracks.forEach(track => player.queue.add(track));
                    // const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cure) => ({duration: acc.duration + cure.duration})).duration, true);
                    // msg.edit(`**${res.playlist.info.name}** (${duration}) (${res.playlist.tracks.length} tracks) has been added to the queue by **${res.tracks[0].requester.tag}**`);
                    // if(!player.playing) player.play()
                    return message.channel.send("Playlist functionality is currently disabled. Please try again later.")
                    break;
            }
        }).catch(err => msg.edit(err.message))
    },
};