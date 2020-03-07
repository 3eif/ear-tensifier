const premium = require('../../utils/premium.js');

module.exports = {
    name: "eq",
    description: "Sets the equalizer of the current playing song.",
    args: true,
    async execute(client, message, args) {
        // if(!premium(message.author.id, "Supporter")) return message.channel.send(`This command is only available to **Premium** users. Click here to get premium: https://www.patreon.com/join/eartensifier`)

        // const voiceChannel = message.member.voice.channel;
        // const player = client.music.players.get(message.guild.id);

        // if(!voiceChannel) return message.channel.send("You need to be in a voice channel to use this command");
        // if(voiceChannel != message.guild.members.cache.get(client.user.id).voice.channel) return message.channel.send("You are not in the same voice channel as the bot.");

        // if(!player) return message.channel.send("There is nothing currently playing to equalize.")
    }
}