const { ErelaClient, Utils } = require("erela.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const channels = require("../data/channels.json");
const Discord = require('discord.js');
const Event = require('../Event');
const tokens = require("../tokens.json");
const mongoose = require("mongoose");
const bot = require("../models/bot.js");
const { webhooks } = require("../tokens.json");

const webhookClient = new Discord.WebhookClient(webhooks["webhookID"], webhooks["webhookToken"]);
const webhookClient2 = new Discord.WebhookClient(webhooks["streamID"], webhooks["streamToken"]);

const nodes = [{
    host: "localhost",
    port: 25566,
    password: "youshallnotpass",
}]

mongoose.connect(`mongodb+srv://${tokens.mongoUsername}:${encodeURIComponent(tokens.mongoPass)}@tetracyl-unhxi.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = class Ready extends Event {
    constructor(...args) {
        super(...args)
    }

    async run(client) {

        this.client.music = new ErelaClient(this.client, nodes)
            .on("nodeError", console.log)
            .on("nodeConnect", () => console.log)
            .on("queueEnd", player => {
                //player.textChannel.send("");
                return this.client.music.players.destroy(player.guild.id)
            })
            .on("trackStart", ({ textChannel }, { title, duration, thumbnail, author, uri, requester }) => {
                const embed = new Discord.MessageEmbed()
                    .setTitle(author)
                    .setThumbnail(thumbnail)
                    .setDescription(`[${title}](${uri})`)
                    .addField('Duration', `${Utils.formatTime(duration, true)}`, true)
                    .addField('Requested by', requester.tag, true)
                    .setColor(colors.main);
                textChannel.send(embed);
            })

        this.client.levels = new Map()
            .set("none", 0.0)
            .set("low", 0.10)
            .set("medium", 0.15)
            .set("high", 0.25);

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

                    setInterval(() => {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor("Ear Tensifier", this.client.settings.avatar)
                            .setColor(colors.main)
                            .setDescription(`Ear Tensifier is currently playing on **${this.client.music.players.size} server(s)**.`)
                            .setTimestamp()

                        webhookClient2.send({
                            username: 'Ear Tensifier',
                            avatarURL: this.client.settings.avatar,
                            embeds: [embed],
                        });
                    }, 3000000);
                });
        }
    }
}

