const Discord = require("discord.js");
const emojis = require("../../recourses/emojis.json");
const colors = require("../../recourses/colors.json");
const { Utils } = require("erela.js");

module.exports = {
    name: "clear",
    description: "Clears the queue.",
    cooldown: "10",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);
        
        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to use this command");
        if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.id) return message.channel.send("You are not in the same voice channel as the bot.");

        if(!player) return message.channel.send("There is nothing currently playing to clear.")

        player.queue.clear(); 
        return message.channel.send(`Cleared the queue.`);
    }
}