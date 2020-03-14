const Discord = require("discord.js");

const { Utils } = require("erela.js");

module.exports = {
    name: "pause",
    description: "Pauses the song",
    cooldown: "5",
    aliases: ["resume"],
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!voiceChannel) return client.responses('noVoiceChannel', message);
        if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

        if(!player) return client.responses('noSongsPlaying', message)

        player.pause(player.playing);
        return message.channel.send(`Song is now **${player.playing ? "resumed" : "paused"}.**`)
    }
}