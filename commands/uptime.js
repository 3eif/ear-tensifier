const Discord = require("discord.js");
const emojis = require("../data/emojis.json")
const colors = require("../data/colors.json")

module.exports = {
    name: "uptime",
    description: "Displays the bot's uptime.",
    async execute(client, message, args) {
        const msg = await message.channel.send(`${emojis.loading} Fetching uptime...`);

        const totalSeconds = process.uptime();
        const realTotalSecs = Math.floor(totalSeconds % 60);
        const days = Math.floor((totalSeconds % 31536000) / 86400);
        const hours = Math.floor((totalSeconds / 3600) % 24);
        const mins = Math.floor((totalSeconds / 60) % 60);

        return msg.edit(`Uptime: \`${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds\``);
    },
};
