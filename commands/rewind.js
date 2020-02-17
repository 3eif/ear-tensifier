const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");
const fastForwardNum = 10;

module.exports = {
    name: "rewind",
    description: "Rewinds a song (default 10 seconds).",
    cooldown: "10",
    usage: "<seconds>",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);
        
        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to use this command");
        if(voiceChannel != message.guild.members.get(client.user.id).voice.channel) return message.channel.send("You are not in the same voice channel as the bot.");

        if(!player) return message.channel.send("There is nothing currently playing to seek.")

        if(!args[0]){
            if((player.position - fastForwardNum*1000) > 0){
                player.seek(player.position - fastForwardNum*1000)
                return message.channel.send(`Rewinding to ${Utils.formatTime(player.position, true)}`);
            } else {
                return message.channel.send("Cannot rewind to negative duration.")
            }
        } else if(!isNaN(args[0]) && (player.position - args[0]*1000) > player.queue[0].duration){
            player.seek(player.position - args[0]*1000)
            return message.channel.send(`Rewinding to ${Utils.formatTime(player.position, true)}`);
        } else {
            if(isNaN(args[0])) return message.reply(`Invalid number.\nCorrect Usage: \`${client.settings.prefix}rewind <seconds>\``)
            return message.channel.send("Cannot rewind to negative duration.")
        }
    }
}