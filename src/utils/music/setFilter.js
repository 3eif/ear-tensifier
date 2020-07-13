const Discord = require('discord.js');

module.exports = async (client, message, filter, state) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const player = client.music.players.get(message.guild.id);

    if (!state) {
        player.setEQ(...Array(13).fill(0).map((n, i) => ({ band: i, gain: 0.1 })));
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
                player.setEQ(
                    { 'band': 0, 'gain': 0.6 },
                    { 'band': 1, 'gain': 0.67 },
                    { 'band': 2, 'gain': 0.67 },
                    { 'band': 3, 'gain': 0 },
                    { 'band': 4, 'gain': -0.5 },
                    { 'band': 5, 'gain': 0.15 },
                    { 'band': 6, 'gain': -0.45 },
                    { 'band': 7, 'gain': 0.23 },
                    { 'band': 8, 'gain': 0.35 },
                    { 'band': 9, 'gain': 0.45 },
                    { 'band': 10, 'gain': 0.55 },
                    { 'band': 11, 'gain': 0.6 },
                    { 'band': 12, 'gain': 0.55 },
                    { 'band': 13, 'gain': 0 },
                );
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