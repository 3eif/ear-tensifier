const Discord = require('discord.js')
const { KSoftClient } = require('ksoft.js');
const { loading } = require("../../recourses/emojis.json");
const colors = require("../../recourses/colors.json");
var { ksoftToken } = require('../../tokens.json')
const ksoft = new KSoftClient(ksoftToken);

module.exports = {
    name: "lyrics",
    description: "Displays lyrics of a song.",
    args: true,
    usage: "<search query>",
    cooldown: 20,
    async execute(client, message, args) {
        let msg = await message.channel.send(`${loading} Fetching lyrics...`)
        let song = args.join(' ')
        const data = await ksoft.lyrics.get(song, false)
            .catch(err => {
                return message.channel.send(err.message)
            });
        if (data.lyrics.length > 2048) return message.reply("Lyrics were too long.")
        const embed = new Discord.MessageEmbed()
            .setTitle(`${data.name}`)
            .setAuthor(`${data.artist.name}`)
            .setDescription(data.lyrics)
            .setColor(colors.main)
            .setFooter(`Powered by KSoft.Si`)
        msg.edit("", embed)
    }
}