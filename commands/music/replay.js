const Discord = require("discord.js");
const emojis = require("../../recourses/emojis.json");
const colors = require("../../recourses/colors.json");
const { Utils } = require("erela.js");

module.exports = {
    name: "replay",
    description: "Starts the song from the beginning.",
    cooldown: "10",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);
        
        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to use this command");
        if(!player) return message.channel.send("There is nothing currently playing to seek.")
        if(voiceChannel != message.guild.members.cache.get(client.user.id).voice.id) return message.channel.send("You are not in the same voice channel as the bot.");

        player.seek(0); 
        return message.channel.send(`Replayed song...`);
    }
}