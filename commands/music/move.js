module.exports = {
    name: "move",
    description: "Moves a song to another location in the queue.",
    args: true,
    usage: "<old position> <new position>",
    cooldown: '10',
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(isNaN(args[0])) return message.channel.send(`Invalid number.`)
        if(!voiceChannel) return client.responses('noVoiceChannel', message);
        if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

        if(!player) return client.responses('noSongsPlaying', message)

        if(args[0] == 0) return message.channel.send(`Cannot move a song that is already playing. To skip the current playing song type: \`${client.settings.prefix}skip\``)
        if((args[0] > player.queue.size) || (args[0] && !player.queue[args[0]])) return message.channel.send(`Song not found.`)

        if(!args[1]) {
            let song = player.queue[args[0]];
            player.queue.splice(args[0], 1)
            player.queue.splice(1, 0, song);
            return message.channel.send(`Moved **${song.title}** to the beginning of the queue.`)
        } else if(args[1]){
            if(args[1] == 0) return message.channel.send(`Cannot move a song that is already playing. To skip the current playing song type: \`${client.settings.prefix}skip\``)
            if((args[1] > player.queue.size) || (args[1] && !player.queue[args[1]])) return message.channel.send(`Song not found.`)
            let song = player.queue[args[0]];
            player.queue.splice(args[0], 1)
            player.queue.splice(args[1], 0, song);
            return message.channel.send(`Moved **${song.title}** to the position ${args[1]}.`)
        }
    }
}