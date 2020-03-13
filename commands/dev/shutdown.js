const Discord = require("discord.js");



module.exports = {
    name: "shutdown",
    description: "Shuts down the bot.",
    permission: "dev",
    async execute(client, message, args) {
        const msg = await message.channel.send(`Powering off...`);

        try{
            process.exit();
        } catch(e) {
            client.error(e, true, msg);
        }
    },
};