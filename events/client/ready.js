const { ErelaClient, Utils } = require("erela.js");
const Discord = require('discord.js');

const Event = require('../../structures/Event');
const tokens = require("../../tokens.json");
const mongoose = require("mongoose");
const bot = require("../../models/bot.js");
const users = require("../../models/user.js");
const webhooks = require("../../resources/webhooks.json");
const songs = require("../../models/song.js");
const postHandler = require("../../utils/handlers/post.js");

const webhookClient = new Discord.WebhookClient(webhooks.webhookID, webhooks.webhookToken);

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
            .on("trackStart", ({ textChannel }, { title, duration, author, uri, requester }) => {
                let thumbnail = this.client.music.players.get(textChannel.guild.id).queue[0].displayThumbnail("default");
                addDB(uri, title, author, duration, uri, thumbnail);

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

                //if(this.client.music.players.get(textChannel.guild.id).trackRepeat) return;

                const embed = new Discord.MessageEmbed()
                    .setTitle(author)
                if (uri.includes("soundcloud")) {
                    embed.attachFiles(['./assets/soundcloud.PNG'])
                    embed.setThumbnail('attachment://soundcloud.PNG')
                    embed.setFooter("SoundCloud")
                } else if (uri.includes("bandcamp")) {
                    embed.attachFiles(['./assets/bandcamp.PNG'])
                    embed.setThumbnail('attachment://bandcamp.PNG')
                    embed.setFooter("bandcamp")
                } else if (uri.includes("mixer")) {
                    embed.attachFiles(['./assets/mixer.PNG'])
                    embed.setThumbnail('attachment://mixer.PNG')
                    embed.setFooter("Mixer")
                } else if (uri.includes("twitch")) {
                    embed.attachFiles(['./assets/twitch.PNG'])
                    embed.setThumbnail('attachment://twitch.PNG')
                    embed.setFooter("Twitch")
                } else {
                    embed.setThumbnail(thumbnail)
                    embed.setFooter("Youtube")
                }

                embed.setDescription(`[${title}](${uri})`)
                embed.addField('Duration', `${Utils.formatTime(duration, true)}`, true)
                embed.addField('Requested by', requester.tag, true)
                embed.setColor(this.client.colors.main)
                embed.setTimestamp()
                textChannel.send(embed);
            })

        function addDB(id, title, author, duration, url, thumbnail) {
            let songType = "";
            if (url.includes("youtube")) {
                songType = "youtube";
            }
            if (url.includes("soundcloud")) {
                songType = "soundcloud";
            }
            if (url.includes("bandcamp")) {
                songType = "bandcamp";
            }
            if (url.includes("mixer")) {
                songType = "mixer";
            }
            if (url.includes("twitch")) {
                songType = "twitch";
            }

            songs.findOne({
                songID: id,
            }, async (err, s) => {
                if (err) console.log(err);
                if (!s) {
                    const newSong = new songs({
                        songID: id,
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
                        .setColor(this.client.colors.main)
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

                    if(this.client.user.id != '472714545723342848') return;
                    postHandler(this.client, totalGuilds, this.client.shard.count, this.client.shard.id, totalMembers);
                    require("../../utils/dbl.js").startUp(this.client);
                });
        }
    }
}

