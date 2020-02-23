module.exports = {
    name: "support",
    description: "Sends the support server for the bot.",
    aliases: ["server"],
    async execute(client, message, args) {
        return message.channel.send(`Here is my support server: ${client.settings.server}`);
    }
}