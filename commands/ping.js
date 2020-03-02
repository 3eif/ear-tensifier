const Discord = require("discord.js");
const emojis = require("../data/emojis.json")
const colors = require("../data/colors.json")

module.exports = {
    name: "ping",
    description: "Bot's latency",
    async execute(client, message, args) {
        const msg = await message.channel.send(`${emojis.loading} Pinging...`);

        const embed = new Discord.MessageEmbed()
            .setAuthor("Pong!", client.settings.avatar)
            .setDescription(`Latency \`${msg.createdTimestamp - message.createdTimestamp}ms\`. API Latency \`${Math.round(client.ws.ping)}ms\``)
            .setColor(colors.main)
            .setTimestamp();
        msg.edit("", embed);
    },
};