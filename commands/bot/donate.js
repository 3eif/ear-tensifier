module.exports = {
    name: "donate",
    description: "Sends a link to Ear Tensifier's patreon page.",
    aliases: ["patreon"],
    async execute(client, message, args) {
        return message.channel.send("Donate: https://www.patreon.com/eartensifier");
    }
}