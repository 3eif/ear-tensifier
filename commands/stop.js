const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");

module.exports = {
    name: "stop",
    description: "Stops the queue.",
    cooldown: "10",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to use this command");
        if(voiceChannel != message.guild.members.get(client.user.id).voice.channel) return message.channel.send("You are not in the same voice channel as the bot.");


        player.pause(player.playing);
        return message.channel.send(`Stopped...`)
    }
}