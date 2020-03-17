const premium = require('../../utils/premium/premium.js');
const Discord = require('discord.js');

module.exports = {
    name: "soft",
    description: "Turns on soft filter",
    cooldown: '10',
    async execute(client, message, args) {
        if(await premium(message.author.id, "Premium") == false) return client.responses('noPremium', message);

        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if (!voiceChannel) return client.responses('noVoiceChannel', message);
        if (voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

        if (!player) return client.responses('noSongsPlaying', message);

        const delay = ms => new Promise(res => setTimeout(res, ms));

        if (args[0] && (args[0].toLowerCase() == "reset" || args[0].toLowerCase() == "off")) {
            player.setEQ(Array(13).fill(0).map((n, i) => ({ band: i, gain: 0.15 })))
            let msg = await message.channel.send(`${client.emojiList.loading} Turning off **soft**. This may take a few seconds...`)
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`Soft off`)
                .setColor(client.colors.main);
            await delay(5000);
            return msg.edit("", embed);
        }

        player.setEQ(client.filters.soft);

        let msg = await message.channel.send(`${client.emojiList.loading} Turning on **soft**. This may take a few seconds...`)
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`Soft filter on`)
            .setFooter(`Reset filter: ear reset`)
            .setColor(client.colors.main);
        await delay(5000);
        return msg.edit("", embed);
    }
}