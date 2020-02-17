const Discord = require("discord.js");
const moment = require("moment");
const Event = require('../Event');
const colors = require("../data/colors.json")
const channel = require("../data/channels.json")

module.exports = class GuildCreate extends Event {
    constructor(...args) {
        super(...args)
    }

    async run(guild) {
        this.client.shard.fetchClientValues('guilds.size').then(guilds => {

            this.client.user.setActivity(`ear help | ${require('util').inspect(guilds.reduce((prev, val) => prev + val, 0))} servers`);

            let guildEmbed = new Discord.MessageEmbed()
                .setAuthor(`Ear Tensifier | Guild ID: ${guild.id}`, this.client.user.displayAvatarURL())
                .setColor(colors.main)
                .setThumbnail(guild.iconURL())
                .setDescription("Ear Tensifier has been **ADDED** to a server.")
                .addField("Guild", `${guild.name}`, true)
                .addField("Users", `${guild.memberCount}`, true)
                .addField("Owner", `${guild.owner.user.username}`, true)
                .addField("Region", `${guild.region}`, true)
                .setFooter(`Created On - ${moment(guild.createdAt).format('LLLL')}`, guild.iconURL())
                .setTimestamp();

            this.client.channels.get(channel.guildEvents).send(guildEmbed);

            //   const dbl = new DBL(config.dblToken, this.client)
            //   snekfetch.post(`https://discordbots.org/api/bots/472714545723342848/stats`)
            //   .set('Authorization', config.dblToken)
            //   .send({ server_count: require('util').inspect(guilds.reduce((prev, val) => prev + val, 0)), 
            //         shard_count: this.client.shard.count})
            //   .then(() => console.log(`Posted to dbl.`))
            //   .catch((e) => console.error(e));
        })
    }
}