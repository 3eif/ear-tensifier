const Discord = require("discord.js");
;

const { Utils } = require("erela.js");

module.exports = {
    name: "skip",
    description: "Skips the current song",
    aliases: ["s"],
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!voiceChannel) return client.responses('noVoiceChannel', message);
        if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);
        if(!player) return client.responses('noSongsPlaying', message)

        if(player) player.stop()
        return message.channel.send(`Skipped...`)
    }
}