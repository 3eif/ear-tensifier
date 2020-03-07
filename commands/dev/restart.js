const Discord = require("discord.js");
const emojis = require("../../data/emojis.json")
const colors = require("../../data/colors.json")
const { discordToken, testingToken } =  require("../../tokens.json");

module.exports = {
    name: "restart",
    description: "Restarts the bot.",
    permissions: "dev",
    async execute(client, message, args) {
        const msg = await message.channel.send(`Restarting the bot...`);

        try{
            resetBot(message.channel);
            function resetBot(channel) {
                if(client.settings.testing){
                    message.react('✅')
                    .then(message => client.destroy())
                    .then(() => client.login(testingToken));
                } else {
                    message.react('✅')
                    .then(message => client.destroy())
                    .then(() => client.login(discordToken));
                }
            }
        } catch(e) {
            client.error(e, true, msg);
        }
    },
};