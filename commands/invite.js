module.exports = {
    name: "invite",
    description: "Sends the invite link for the bot.",
    async execute(client, message, args) {
        return message.channel.send("Here is my invite link: https://eartensifier.net/invite");
    }
}