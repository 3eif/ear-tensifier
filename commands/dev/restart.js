const { discordToken } =  require("../../tokens.json");

module.exports = {
    name: "restart",
    description: "Restarts the bot.",
    permissions: "dev",
    async execute(client, message, args) {
        // const msg = await message.channel.send(`Restarting the bot...`);

        // try{
        //     resetBot(message.channel);
        //     function resetBot(channel) {
        //         message.react('✅')
        //         .then(message => client.destroy())
        //         .then(() => client.login(discordToken));
        //     }
        // } catch(e) {
        //     client.error(e, true, msg);
        // }
    },
};