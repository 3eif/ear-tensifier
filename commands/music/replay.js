const Discord = require("discord.js");
;

const { Utils } = require("erela.js");

module.exports = {
    name: "replay",
    description: "Starts the song from the beginning.",
    cooldown: "10",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);
        
        if(!voiceChannel) return client.responses('noVoiceChannel', message);
        if(!player) return client.responses('noSongsPlaying', message)
        if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

        player.seek(0); 
        return message.channel.send(`Replayed song...`);
    }
}