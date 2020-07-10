const Discord = require('discord.js');

module.exports = async (client, message, filter, state) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const player = client.music.players.get(message.guild.id);

    if (!state) {
        player.setFilter('filters', client.filters.reset);
        const msg = await message.channel.send(`${client.emojiList.loading} Turning off **${filter}**. This may take a few seconds...`);
        const embed = new Discord.MessageEmbed()
            .setDescription(`Turned off **${filter}**`)
            .setColor(client.colors.main);
        await delay(5000);
        return msg.edit('', embed);
    }
    else if (state) {
        switch (filter) {
            case 'bass':
                player.setFilter('filters', client.filters.bass);
                break;
            case 'treblebass':
                player.setFilter('filters', client.filters.treblebass);
                break;
            case 'nightcore':
                player.setFilter('filters', client.filters.nightcore);
                break;
            case 'vaporwave':
                player.setFilter('filters', client.filters.vaporwave);
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