const { earrape } = require("../../resources/volume.json")

module.exports = {
    name: "earrape",
    description: "Earrapes a song.",
    aliases: ["veryloud", "hell", "loud"],
    cooldown: '10',
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!voiceChannel) return client.responses('noVoiceChannel', message);
        if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

        if(!player) return client.responses('noSongsPlaying', message)

        player.setVolume(earrape);
        return message.channel.send(`Tensity set to **earrape**`);
    }
}