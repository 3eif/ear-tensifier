const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");

const mongoose = require("mongoose");
const users = require("../models/user.js");
const { mongoUsername, mongoPass } = require("../tokens.json");

mongoose.connect(`mongodb+srv://${mongoUsername}:${mongoPass}@tetracyl-unhxi.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = {
    name: "add",
    description: "Adds a song to your favorites.",
    args: true,
    usage: "<song/song id>",
    async execute(client, message, args) {

        const msg = await message.channel.send(`${emojis.cd}  Searching for ${args.join(" ")}...`)

        client.music.search(args.join(" "), message.author).then(async res => {
            let videoID = res.tracks[0].uri.split("v=")[1]

            users.findOne({
                authorID: message.author.id
            }, async (err, u) => {
                if (err) console.log(err);
                if (!u) {
                    const newUser = new users({
                        authorID: message.author.id,
                        authorName: message.author.tag,
                        bio: "",
                        songsPlayed: 0,
                        commandsUsed: 0,
                        blocked: true,
                        supporter: false,
                        supporterPlus: false,
                        supporterPlusPlus: false,
                        supporterInfinite: false,
                        developer: false,
                        favoriteSongs: []
                    });
                    newUser.save().catch(e => console.log(e));
                }
                if(u.favoriteSongs.includes(videoID)) return msg.edit("You have already added that song.");
                u.favoriteSongs.push(videoID);
                u.save().catch(e => console.log(e));
            });

            msg.edit(`Added **${res.tracks[0].title}** to your liked songs.`)
        }).catch(err => message.channel.send(err.message))
    },
};