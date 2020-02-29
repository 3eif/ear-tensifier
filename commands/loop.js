const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");

module.exports = {
    name: "loop",
    description: "Repeats the current queue/song",
    aliases: ["repeat", "unloop"],
    usage: "<queue/song>",
    cooldown: '10',
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to use this command");
        if(voiceChannel != message.guild.members.cache.get(client.user.id).voice.channel) return message.channel.send("You are not in the same voice channel as the bot.");

        if(!player) return message.channel.send("There is nothing currently playing to loop.")

        if(!args[0] || args[0].toLowerCase() == "song") {
            if(player.trackRepeat === false){
                player.setTrackRepeat(true);
                return message.channel.send("Song is now being looped");
            }else{
                player.setTrackRepeat(false);
                return message.channel.send("Song has been unlooped");
            }
        } else if(args[0] == queue){
            if(player.setQueueRepeat){
                player.setQueueRepeat(false);
                return message.channel.send("Queue has been unlooped.");
            } else {
                player.setQueueRepeat(true);
                return message.channel.send("Queue is now being looped.");
            }
        }
    }
}