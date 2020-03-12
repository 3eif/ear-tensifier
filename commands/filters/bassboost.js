const premium = require('../../utils/premium.js');
const emojis = require('../../recourses/emojis.json');
const colors = require('../../recourses/colors.json');
const Discord = require('discord.js');

module.exports = {
    name: "bassboost",
    description: "Bassboosts a song",
    aliases: ["bb"],
    cooldown: '10',
    usage: "<amount (-10 - 10)>",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to use this command");
        if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.id) return message.channel.send("You are not in the same voice channel as the bot.");

        if(!player) return message.channel.send("There is nothing currently playing to bassboost.")

        if(!args[0]){
            player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.8 })))
            return message.channel.send(`Setting tensity to **bassboost**. This may take a few seconds...`);
        }

        if(args[0].toLowerCase() == "reset" || args[0].toLowerCase() == "off") {
            player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.15 })))
            return message.channel.send(`**Bassboost** turned off. This may take a few seconds...`);
        }

        if(isNaN(args[0])) return message.channel.send("Amount must be a real number.")

        const delay = ms => new Promise(res => setTimeout(res, ms));
        if(args[0] > 10 || args[0] < -10) {
            if(!premium(message.author.id, "Supporter")) {
                return message.channel.send(`Only **Premium** users can set the bassboost higher. Click here to get premium: https://www.patreon.com/join/eartensifier`)
            } else player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: args[0]/10 })));
        } else player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: args[0]/10 })));

        let msg = await message.channel.send(`${emojis.loading} Setting bassboost to **${args[0]}dB**. This may take a few seconds...`)
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`Bassboost set to: **${args[0]}dB**`)
        .setFooter(`Default bassboost: 0`)
        .setColor(colors.main);
        await delay(5000);
        return msg.edit("", embed);
    }
}