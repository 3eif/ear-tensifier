const Discord = require("discord.js");
const emojis = require("../data/emojis.json")
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");

module.exports = {
    name: "streams",
    description: "Displays how many servers the bot is streaming on.",
    async execute(client, message, args) {
        return message.channel.send(`The bot is currently streaming on **${client.music.playersPlayers.size}** server(s).`);
    },
};