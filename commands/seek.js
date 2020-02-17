const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");

module.exports = {
    name: "seek",
    description: "Skips to a timestamp in the song.",
    cooldown: "10",
    args: true,
    usage: "<seconds>",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);
        
        if(isNaN(args[0])) return message.reply(`Invalid number. Please provide a number in seconds.\nCorrect Usage: \`${client.settings.prefix}seek <seconds>\``)
        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to use this command");
        if(voiceChannel != message.guild.members.get(client.user.id).voice.channel) return message.channel.send("You are not in the same voice channel as the bot.");

        if(!player) return message.channel.send("There is nothing currently playing to seek.")
        if(args[0] >= player.queue[0].duration ||args[0] < 0) return message.channel.send(`Cannot seek beyond length of song.`);

        player.seek(args[0]*1000); 
        return message.channel.send(`Seeked to ${Utils.formatTime(player.position, true)}`);
    }
}