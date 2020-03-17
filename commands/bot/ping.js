const Discord = require("discord.js");

module.exports = {
    name: "ping",
    description: "Bot's latency",
    async execute(client, message, args) {
        const msg = await message.channel.send(`${client.emojiList.loading} Pinging...`);
        return msg.edit(`Pong! (Latency: ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency: ${Math.round(client.ws.ping)}ms.)`)
    },
};