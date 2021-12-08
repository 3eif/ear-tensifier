const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Shards extends Command {
    constructor(client) {
        super(client, {
            name: 'shards',
            description: {
                content: 'Displays the bot\'s shards.',
            },
            cooldown: '4',
            aliases: ['shardstats', 'shardinfo'],
            enabled: true,
            args: false,
        });
    }
    async run(client, ctx) {
        const embeds = [];
        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval(c => c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)),
        ];

        const shardInfo = await client.shard.broadcastEval(c => ({
            id: c.shard.ids,
            shards: c.shard.shards,
            status: c.shard.client.presence.status,
            guilds: c.guilds.cache.size,
            channels: c.channels.cache.size,
            members: c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0),
            memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            players: c.music.players.size,
            playingPlayers: c.music.getPlayingPlayers().size,
            ping: c.ws.ping,
        }));

        for (let n = 0; n < shardInfo.length / 15; n++) {
            const shardArray = shardInfo.slice(n * 15, n * 15 + 15);

            const embed = new MessageEmbed()
                .setColor(client.config.colors.default)
                .setAuthor('Ear Tensifier', client.user.displayAvatarURL());

            let totalPlayers = 0;
            let totalPlayingPlayers = 0;
            shardArray.forEach(i => {
                const status = i.status === 'online' ? client.config.emojis.online : client.config.emojis.offline;
                embed.addField(`${status} Shard ${(parseInt(i.id)).toString()}`, `\`\`\`js\nServers: ${i.guilds.toLocaleString()}\nChannels: ${i.channels.toLocaleString()}\nUsers: ${i.members.toLocaleString()}
Memory: ${Number(i.memoryUsage).toLocaleString()} MB\nAPI: ${i.ping.toLocaleString()} ms\nPlayers: ${i.playingPlayers.toLocaleString()}/${i.players.toLocaleString()}\`\`\``, true);
                totalPlayers += i.players;
                totalPlayingPlayers += i.playingPlayers;
            });


            Promise.all(promises)
                .then(async results => {
                    let totalMemory = 0;
                    shardArray.forEach(s => totalMemory += parseInt(s.memoryUsage));
                    let totalChannels = 0;
                    shardArray.forEach(s => totalChannels += parseInt(s.channels));
                    let avgLatency = 0;
                    shardArray.forEach(s => avgLatency += s.ping);
                    avgLatency = avgLatency / shardArray.length;
                    avgLatency = Math.round(avgLatency);
                    const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
                    const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

                    embed.setDescription(`This guild is currently on **Shard ${client.shard.ids}**.`);
                    embed.addField(client.config.emojis.online + ' Total Stats', `\`\`\`js
Total Servers: ${totalGuilds.toLocaleString()}\nTotal Channels: ${totalChannels.toLocaleString()}\nTotal Users: ${totalMembers.toLocaleString()}\nTotal Memory: ${totalMemory.toFixed(2)} MB\nAvg API Latency: ${avgLatency} ms\nTotal Players: ${totalPlayingPlayers}/${totalPlayers}\`\`\``);
                    embed.setTimestamp();
                    embeds.push(embed);
                    if (embeds.length == Math.ceil(shardArray.length)) {
                        await ctx.messageHelper.paginate(embeds);
                    }
                });
        }
    }
};
