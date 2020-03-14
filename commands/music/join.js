const Discord = require("discord.js");

const { Utils } = require("erela.js");

module.exports = {
    name: "join",
    description: "Joins the voice channel you are in.",
    aliases: ["summon"],
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return client.responses('noVoiceChannel', message);
        
        voiceChannel.join();
        return message.channel.send(`Joined ${client.emojiList.voice}**${voiceChannel}**`)
    }
}