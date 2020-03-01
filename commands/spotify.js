const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");
let { getData, getPreview } = require("spotify-url-info");

module.exports = {
    name: "spotify",
    async execute(client, message, args) {
        let data = await getPreview("https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas");
        message.channel.send(data.title);
    }
}