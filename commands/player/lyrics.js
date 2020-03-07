const { KSoftClient } = require('ksoft.js');
const { MessageEmbed } = require('discord.js')
var { ksoft_key } = require('../../tokens.json')
const ksoft = new KSoftClient(ksoft_key);

module.exports = {
    name: "lyrics",
    description: "Displays lyrics.",
    usage: "<songname>",
    async execute(client, message, args) {
        let song = args.join(' ')
        const respond = await ksoft.lyrics.get(song, false)
            .catch(err => {
                return message.channel.send(err.message)
            });
        if (respond.lyrics.length > 2048) return message.reply("Lyrics is too long.")
        const embed = new MessageEmbed()
            .setFooter(`Lyrics Command`)
            .setAuthor(`Song: ${respond.name} by ${respond.artist.name}`)
            .setDescription(respond.lyrics)
            .setFooter(`Get by AgentBot`)

        return message.channel.send(embed)

    }
}