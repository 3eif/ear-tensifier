module.exports = {
    name: "version",
    description: "Changes version of the bot.",
    args: true,
    permission: "dev",
    async execute(client, message, args) {
        client.settings.version = args[0];
        return message.channel.send(`Version set to \`${client.settings.version}\``);
    },
};