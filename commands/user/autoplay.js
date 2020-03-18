const premium = require('../../utils/premium/premium.js');
const users = require("../../models/user.js");
let { getData, getPreview } = require("spotify-url-info");
const { Utils } = require("erela.js");

module.exports = {
    name: "autoplay",
    description: "Configures the song to autoplay when the queue ends.",
    usage: "<search query/link>",
    cooldown: 5,
    async execute(client, message, args) {
        const msg = await message.channel.send(`${client.emojiList.loading} Adding song(s)...`);

    },
};