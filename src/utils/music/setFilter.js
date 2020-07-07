const Discord = require('discord.js');

module.exports = async (client, message, filter, state) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const player = client.music.players.get(message.guild.id);

    if (!state) {
        player.setEqualizer(Array(13).fill(0).map((n, i) => ({ band: i, gain: 0.15 })));
        const msg = await message.channel.send(`${client.emojiList.loading} Turning off **${filter}**. This may take a few seconds...`);
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Turned off **${filter}**`)
            .setColor(client.colors.main);
        await delay(5000);
        return msg.edit('', embed);
    }
    else if (state) {
        switch (filter) {
            case 'bass':
                player.setEqualizer(client.filters.bass);
                break;
            case 'soft':
                player.setEqualizer(client.filters.soft);
                break;
            case 'pop':
                player.setEqualizer(client.filters.pop);
                break;
            case 'treblebass':
                player.setEqualizer(client.filters.treblebass);
                break;
            default:
        }

        const msg = await message.channel.send(`${client.emojiList.loading} Turning on **${filter}**. This may take a few seconds...`);
        const embed = new Discord.MessageEmbed()
            .setDescription(`Turned on **${filter}**`)
            .setColor(client.colors.main);
        await delay(5000);
        return msg.edit('', embed);
    }
};