const Discord = require("discord.js");

const { Utils } = require("erela.js");

module.exports = {
    name: "queueloop",
    description: "Loops the queue",
    cooldown: '10',
    aliases: ["loopqueue", "repeatqueue", "queuerepeat"],
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!voiceChannel) return client.responses('noVoiceChannel', message);
        if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

        if(!player) return client.responses('noSongsPlaying', message)

        if(player.queueRepeat === true){
            player.setQueueRepeat(false);
            return message.channel.send("Queue has been unlooped.");
        } else {
            player.setQueueRepeat(true);
            return message.channel.send("Queue is being looped.");
        }
    }
}