const Discord = require("discord.js");
const Event = require('../structures/Event');


const patreonData = require("../resources/patreon.json");
const webhooks = require("../resources/webhooks.json");
const patreon = require('../utils/patreon.js');
const webhookClient = new Discord.WebhookClient(webhooks.patreonWebhookID, webhooks.patreonWebhookToken);

module.exports = class GuildMemberUpdate extends Event {
    constructor(...args) {
        super(...args)
    }

    async run(oldMember, newMember) {
        if (oldMember.guild.id != this.client.settings.supportID) return;

        if (oldMember.roles !== newMember.roles) {

            if (oldMember.roles.cache.find(r => r.name === "Supporter") && !newMember.roles.cache.find(r => r.name === "Supporter")) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor("Deleted Patreon", "https://cdn.discordapp.com/avatars/216303189073461248/00a6db63b09480d1613877bf40e98bea.webp?size=2048")
                    .setColor(this.client.colors.main)
                    .setThumbnail(newMember.user.avatarURL())
                    .setDescription(`**${newMember.user.tag}** (${newMember.user.id}) is no longer a Patreon supporter.`)
                    .setTimestamp()

                webhookClient.send({
                    username: 'Ear Tensifier',
                    avatarURL: this.client.settings.avatar,
                    embeds: [embed],
                });

                return patreon(newMember.user, "Remove")
            } //else if (oldMember.roles.cache.find(r => r.name === "Supporter")) return;

            if (!newMember.roles.cache.find(r => r.name === "Supporter") && !newMember.roles.cache.find(r => r.name === "Supporter+") && !newMember.roles.cache.find(r => r.name === "Supporter++") && !newMember.roles.cache.find(r => r.name === "Supporter ∞")) return;

            const embed = new Discord.MessageEmbed()
                .setAuthor("New Patreon!", "https://cdn.discordapp.com/avatars/216303189073461248/00a6db63b09480d1613877bf40e98bea.webp?size=2048")
                .setColor(this.client.colors.main)
                .setThumbnail(newMember.user.avatarURL())
                .setDescription(`**${newMember.user.tag}** (${newMember.user.id}) is now a Patreon supporter!`)
                .setTimestamp()

            if (newMember.roles.cache.find(r => r.name === "Supporter ∞")) {
                embed.addField("Tier", "Supporter ∞", true)
                embed.addField("Pledge", patreonData.sinfinite, true)

                patreon(newMember.user, "Supporter ∞");

            } else if (newMember.roles.cache.find(r => r.name === "Supporter++")) {
                embed.addField("Tier", "Supporter++", true)
                embed.addField("Pledge", patreonData.splusplus, true)

                patreon(newMember.user, "Supporter++");

            } else if (newMember.roles.cache.find(r => r.name === "Supporter+")) {
                embed.addField("Tier", "Supporter+", true)
                embed.addField("Pledge", patreonData.splus, true)

                patreon(newMember.user, "Supporter+");

            } else if (newMember.roles.cache.find(r => r.name === "Supporter")) {
                embed.addField("Tier", "Supporter", true)
                embed.addField("Pledge", patreonData.s, true)

                patreon(newMember.user, "Supporter");
            }

            webhookClient.send({
                username: 'Ear Tensifier',
                avatarURL: this.client.settings.avatar,
                embeds: [embed],
            });
        }
    }
}