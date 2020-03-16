const tokens = require("../tokens.json");
const { ErelaClient } = require("erela.js");
const trackStart = require("./trackStart.js");

module.exports = async (client) => {
    client.music = new ErelaClient(client, tokens.nodes)
        .on("nodeError", console.log)
        .on("nodeConnect", () => console.log)
        .on("queueEnd", player => {
            //player.textChannel.send("");
            return client.music.players.destroy(player.guild.id)
        })
        .on("trackStart", ({ textChannel }, { title, duration, author, uri, requester }) => {
            trackStart(client, textChannel, title, duration, author, uri, requester)
        })
}