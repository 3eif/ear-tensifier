const { ErelaClient, Utils } = require("erela.js");
const colors = require("../data/colors.json");
const Discord = require('discord.js');
const Event = require('./Event');
const tokens = require("../tokens.json");
const mongoose = require("mongoose");
const bot = require("../models/bot.js");
const users = require("../models/user.js");
const { webhooks } = require("../tokens.json");
const songs = require("../models/song.js");

const webhookClient = new Discord.WebhookClient(webhooks["webhookID"], webhooks["webhookToken"]);

mongoose.connect(`mongodb+srv://${tokens.mongoUsername}:${encodeURIComponent(tokens.mongoPass)}@tetracyl-unhxi.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = class Ready extends Event {
    constructor(...args) {
        super(...args)
    }

    async run(client) {

        this.client.music = new ErelaClient(this.client, tokens.nodes)
            .on("nodeError", console.log)
            .on("nodeConnect", () => console.log)
            .on("queueEnd", player => {
                //player.textChannel.send("");
                return this.client.music.players.destroy(player.guild.id)
            })
            .on("trackStart", ({ textChannel }, { title, duration, thumbnail, author, uri, requester }) => {
                addDB(uri.split("v=")[1], title, author, duration, uri, thumbnail);

                bot.findOne({
                    clientID: this.client.user.id
                }, async (err, b) => {
                    if (err) console.log(err);

                    b.songsPlayed += 1;
                    await b.save().catch(e => console.log(e));
                });

                users.findOne({
                    authorID: requester.id
                }, async (err, u) => {
                    if (err) console.log(err);

                    u.songsPlayed += 1;
                    await u.save().catch(e => console.log(e));
                });

                const embed = new Discord.MessageEmbed()
                    .setTitle(author)
                    .setThumbnail(thumbnail)
                    .setDescription(`[${title}](${uri})`)
                    .addField('Duration', `${Utils.formatTime(duration, true)}`, true)
                    .addField('Requested by', requester.tag, true)
                    .setColor(colors.main);
                textChannel.send(embed);
            })

        function addDB(videoID, title, author, duration, url, thumbnail) {
            let songType = "";
            if (url.includes("youtube")) songType = "youtube";
            if (url.includes("soundcloud")) songType = "soundcloud";
            if (url.includes("bandcamp")) sontType = "bancamp";

            songs.findOne({
                songID: videoID,
            }, async (err, s) => {
                if (err) console.log(err);
                if (!s) {
                    const newSong = new songs({
                        songID: videoID,
                        songName: title,
                        songAuthor: author,
                        type: songType,
                        songDuration: duration,
                        timesPlayed: 1,
                        timesAdded: 0,
                        songThumbnail: thumbnail,
                    });
                    await newSong.save().catch(e => console.log(e));
                } else {
                    s.timesPlayed += 1;
                    await s.save().catch(e => console.log(e));
                }
            });
        }

        this.client.levels = new Map()
            .set("none", 0.0)
            .set("low", 0.10)
            .set("medium", 0.15)
            .set("high", 0.25);

        this.client.user.setActivity(`ear help`);

        if (this.client.shard.ids == this.client.shard.count - 1) {
            const promises = [
                this.client.shard.fetchClientValues('guilds.cache.size'),
                this.client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
            ];

            return Promise.all(promises)
                .then(async results => {
                    const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
                    const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
                    console.log(`Ear Tensifier is online: ${this.client.shard.count} shards, ${totalGuilds} servers and ${totalMembers} members.`)

                    setInterval(() => {
                        this.client.user.setActivity(`ear help | ${totalGuilds} servers`);
                    }, 1800000);

                    const embed = new Discord.MessageEmbed()
                        .setAuthor("Ear Tensifier", this.client.settings.avatar)
                        .setColor(colors.main)
                        .setDescription(`Ear Tensifier is online.`)
                        .addField("Shards", `**${this.client.shard.count}** shards`, true)
                        .addField("Servers", `**${totalGuilds}** servers`, true)
                        .setTimestamp()
                        .setFooter(`${totalMembers} users`)

                    webhookClient.send({
                        username: 'Ear Tensifier',
                        avatarURL: this.client.settings.avatar,
                        embeds: [embed],
                    });
                });
        }
    }
}

