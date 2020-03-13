const Discord = require("discord.js");



module.exports = {
    name: "ping",
    description: "Bot's latency",
    async execute(client, message, args) {
        const msg = await message.channel.send(`${client.emojiList.loading} Pinging...`);

        const embed = new Discord.MessageEmbed()
            .setAuthor("Pong!", client.settings.avatar)
            .setDescription(`Latency \`${msg.createdTimestamp - message.createdTimestamp}ms\`. API Latency \`${Math.round(client.ws.ping)}ms\``)
            .setColor(client.colors.main)
            .setTimestamp();
        msg.edit("", embed);
    },
};