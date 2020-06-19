const Command = require('../../structures/Command');

const Discord = require('discord.js');

class Lavalink extends Command {
    constructor(client) {
        super(client, {
            name: 'lavalink',
            description: 'Displays the bot\'s lavalink stats',
            usage: '',
            enabled: true,
            cooldown: 5,
            args: false,
        });
    }
    async run(client, message) {
        const msg = await message.channel.send(`${client.emojiList.loading} Gathering stats...`);

        const stats = client.music.nodes.array()[0].stats;

        const allocated = Math.floor(stats.memory.allocated / 1024 / 1024);
        const used = Math.floor(stats.memory.used / 1024 / 1024);
        const free = Math.floor(stats.memory.free / 1024 / 1024);
        const reservable = Math.floor(stats.memory.reservable / 1024 / 1024);

        const systemLoad = stats.cpu.systemLoad.toFixed(2) * 100;
        const lavalinkLoad = stats.cpu.lavalinkLoad.toFixed(2) * 100;

        const totalSeconds = stats.uptime / 1000;
        const realTotalSecs = Math.floor(totalSeconds % 60);
        const days = Math.floor((totalSeconds % (31536 * 100)) / 86400);
        const hours = Math.floor((totalSeconds / 3600) % 24);
        const mins = Math.floor((totalSeconds / 60) % 60);

        const statsEmbed = new Discord.MessageEmbed()
            .setAuthor('Lavalink Statistics')
            .setColor(client.colors.main)
            .setThumbnail(client.settings.avatar)
            .addField('Playing Players/Players', `\`\`\`${stats.playingPlayers} playing / ${stats.players} players\`\`\``)
            .addField('Memory', `\`\`\`Allocated: ${allocated} MB\nUsed: ${used} MB\nFree: ${free} MB\nReservable: ${reservable} MB\`\`\``)
            .addField('CPU', `\`\`\`Cores: ${stats.cpu.cores}\nSystem Load: ${systemLoad}%\nLavalink Load: ${lavalinkLoad}%\`\`\``)
            .addField('Uptime', `\`\`\`${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds\`\`\``)
            .setTimestamp();

        if(typeof stats.frameStats != 'undefined') statsEmbed.addField('Frame Stats', `\`\`\`Sent: ${stats.frameStats.sent}\nDeficit: ${stats.frameStats.deficit}\nNulled: ${stats.frameStats.nulled}\`\`\``);
        return msg.edit('', statsEmbed);
    }
}

module.exports = Lavalink;