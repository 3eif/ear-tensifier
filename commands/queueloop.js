const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");

module.exports = {
    name: "queueloop",
    description: "Loops the queue",
    cooldown: '10',
    aliases: ["loopqueue", "repeatqueue", "queuerepeat"],
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to use this command");
        if(voiceChannel != message.guild.members.cache.get(client.user.id).voice.channel) return message.channel.send("You are not in the same voice channel as the bot.");

        if(!player) return message.channel.send("There is nothing currently playing to loop.")

        if(player.queueRepeat === true){
            player.setQueueRepeat(false);
            return message.channel.send("Queue has been unlooped.");
        } else {
            player.setQueueRepeat(true);
            return message.channel.send("Queue is being looped.");
        }
    }
}