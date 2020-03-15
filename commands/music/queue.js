const Discord = require("discord.js");

const { Utils } = require("erela.js");

module.exports = {
    name: "queue",
    description: "Displays the queue.",
    aliases: ["q"],
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!player) return message.channel.send("No songs playing.")

        let index = 1;
        const { title, author, duration, uri} = player.queue[0];
        
        const queueEmbed = new Discord.MessageEmbed()
            .setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
            .setColor(client.colors.main)
            .setDescription(`**Now Playing** - [${title}](${uri}) (${Utils.formatTime(duration, true)}) by ${author}.\n\n${player.queue.slice(1, 11).map(song => `**${index++}** - [${song.title}](${song.uri}) (${Utils.formatTime(song.duration, true)}) by ${song.author}.`).join("\n")}`)
            .setFooter(`${player.queue.size} songs | ${Utils.formatTime(player.queue.duration, true)} total duration`)
        message.channel.send(queueEmbed);

    }
}