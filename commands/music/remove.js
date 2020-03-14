const Discord = require("discord.js");

const { Utils } = require("erela.js");

module.exports = {
    name: "remove",
    description: "Removes a song from the queue",
    aliases: ["delete"],
    args: true,
    usage: "<song position>",
    cooldown: '10',
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(isNaN(args[0])) return message.channel.send(`Invalid number.`)
        if(!voiceChannel) return client.responses('noVoiceChannel', message);
        if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

        if(!player) return client.responses('noSongsPlaying', message)

        if(args[0] == 0) message.channel.send(`Cannot remove a song that is already playing. To skip the song type \`${client.settings.prefix}\ skip\``)

        const { title } = player.queue[args[0]-1];

        player.queue.removeFrom(args[0]-2, args[0]-1);
        return message.channel.send(`Removed **${title}** from the queue`)

    }
}