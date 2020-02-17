const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");

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
        if(voiceChannel != message.guild.members.get(client.user.id).voice.channel) return message.channel.send("You are not in the same voice channel as the bot.");

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
        if(args[0] > 10 || args[0] < -10) return message.channel.send("Amount must be between -10 and 10.");
        player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: args[0]/10 })));
        return message.channel.send(`Setting bassboost to **${args[0]}dB**. This may take a few seconds...`);

    }
}