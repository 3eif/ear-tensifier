const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
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
        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to use this command");
        if(voiceChannel != message.guild.members.cache.get(client.user.id).voice.channel) return message.channel.send("You are not in the same voice channel as the bot.");

        if(!player) return message.channel.send("There is nothing currently playing to shuffle.")

        if(args[0] == 0) message.channel.send(`Cannot remove a song that is already playing. To skip the song type \`${client.settings.prefix}\ skip\``)

        const { title } = player.queue[args[0]-1];

        player.queue.removeFrom(args[0]-2, args[0]-1);
        return message.channel.send(`Removed **${title}** from the queue`)

    }
}