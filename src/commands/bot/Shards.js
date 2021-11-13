const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Shards extends Command {
    constructor(client) {
        super(client, {
            name: 'shards',
            description: 'Displays the bot\'s shards',
            cooldown: '4',
            aliases: ['shardstats', 'shardinfo'],
            enabled: true,
            args: false,
        });
    }
    async run(client, ctx) {

        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval(c => c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)),
        ];

        const shardInfo = await client.shard.broadcastEval(c => ({
            id: c.shard.ids,
            status: c.shard.mode,
            guilds: c.guilds.cache.size,
            channels: c.channels.cache.size,
            members: c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0),
            memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            players: c.music.players.size,
            ping: c.ws.ping,
        }));

        const embed = new MessageEmbed()
            .setColor(client.config.colors.default)
            .setAuthor('Ear Tensifier', client.user.displayAvatarURL());

        // let totalMusicStreams = client.music.nodes.array()[0].stats.players;
        shardInfo.forEach(i => {
            console.log(i);
            const status = i.status === 'process' ? client.config.emojis.online : client.config.emojis.offline;
            embed.addField(`${status} Shard ${(parseInt(i.id) + 1).toString()}`, `\`\`\`js
Servers: ${i.guilds.toLocaleString()}\nChannels: ${i.channels.toLocaleString()}\nUsers: ${i.members.toLocaleString()}
Memory: ${Number(i.memoryUsage).toLocaleString()} MB\nAPI: ${i.ping.toLocaleString()} ms\nPlayers: idk\`\`\``, true);
            // totalMusicStreams += i.players;
        });

        Promise.all(promises)
            .then(results => {
                let totalMemory = 0;
                shardInfo.forEach(s => totalMemory += parseInt(s.memoryUsage));
                let totalChannels = 0;
                shardInfo.forEach(s => totalChannels += parseInt(s.channels));
                let avgLatency = 0;
                shardInfo.forEach(s => avgLatency += s.ping);
                avgLatency = avgLatency / shardInfo.length;
                avgLatency = Math.round(avgLatency);
                const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
                const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

                embed.addField(client.config.emojis.online + ' Total Stats', `\`\`\`js
Total Servers: ${totalGuilds.toLocaleString()}\nTotal Channels: ${totalChannels.toLocaleString()}\nTotal Users: ${totalMembers.toLocaleString()}\nTotal Memory: ${totalMemory.toFixed(2)} MB\nAvg. API Latency: ${avgLatency} ms\nTotal Players: idk\`\`\``);
                embed.setTimestamp();
                ctx.sendMessage({ embeds: [embed] });
            });
    }
};
