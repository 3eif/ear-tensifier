const Discord = require("discord.js");

module.exports = {
    name: "reset",
    description: "Resets the filters to normal",
    aliases: ["normal"],
    cooldown: '10',
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!voiceChannel) return client.responses('noVoiceChannel', message);
        if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

        if(!player) return client.responses('noSongsPlaying', message)

        const delay = ms => new Promise(res => setTimeout(res, ms));

        player.setEQ(Array(13).fill(0).map((n, i) => ({ band: i, gain: 0.15 })))
        player.setVolume(100);

        let msg = await message.channel.send(`${client.emojiList.loading} Reseting filters to default...`)
        await delay(5000);
        return msg.edit(`Filters set to default.`);
    }
}