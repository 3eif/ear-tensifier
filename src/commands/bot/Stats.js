const cpuStat = require('cpu-stat');
const os = require('os');
const { EmbedBuilder } = require('discord.js');

const Command = require('../../structures/Command');
const Bot = require('../../models/Bot');

module.exports = class Stats extends Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            description: {
                content: 'Displays the bot\'s stats',
            },
            cooldown: 5,
            args: false,
            slashCommand: true,
        });
    }
    async run(client, ctx) {
        const msg = await ctx.sendDeferMessage(`${client.config.emojis.typing} Gathering stats...`);

        const totalSeconds = process.uptime();
        const realTotalSecs = Math.floor(totalSeconds % 60);
        const days = Math.floor((totalSeconds % (31536 * 100)) / 86400);
        const hours = Math.floor((totalSeconds / 3600) % 24);
        const mins = Math.floor((totalSeconds / 60) % 60);

        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval(c => c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)),
        ];

        const shardInfo = await client.shard.broadcastEval(c => ({
            id: c.shard.id,
            status: c.shard.shards,
            guilds: c.guilds.cache.size,
            channels: c.channels.cache.size,
            users: c.users.cache.size,
            heapUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            players: c.music.players.size,
            playingPlayers: c.music.getPlayingPlayers().size,
            ping: c.ws.ping,
            rss: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
        }));

        Bot.findById(client.user.id, async (err, b) => {
            if (err) client.logger.error(err);
            Promise.all(promises)
                .then(results => {
                    const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
                    const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

                    let totalMemory = 0;
                    shardInfo.forEach(s => totalMemory += Number(s.heapUsed));
                    let totalRSS = 0;
                    shardInfo.forEach(s => totalRSS += Number(s.rss));

                    let avgLatency = 0;
                    shardInfo.forEach(s => avgLatency += s.ping);
                    avgLatency = avgLatency / shardInfo.length;
                    avgLatency = Math.round(avgLatency);

                    const memoryPercentage = ((totalMemory / (os.totalmem() / 1024 / 1024)) * 100).toFixed(2);

                    let totalPlayers = 0;
                    shardInfo.forEach(s => totalPlayers += s.players);
                    let totalPlayingPlayers = 0;
                    shardInfo.forEach(s => totalPlayingPlayers += s.playingPlayers);

                    cpuStat.usagePercent((err, percent) => {
                        const statsEmbed = new EmbedBuilder()
                            .setAuthor({ name: 'Ear Tensifier' })
                            .setColor(client.config.colors.default)
                            .setThumbnail(client.user.displayAvatarURL())
                            .addFields(
                                { name: 'Born On', value: new Date(client.user.createdAt).toLocaleString('en-US', { timezone: 'America/Los_Angeles' }, true) + ' (Pacific Standard Time)' },
                                { name: 'Current Version', value: client.config.version, inline: true },
                                { name: 'Shard', value: `${client.shard.ids}/${client.shard.count}`, inline: true },
                                { name: 'Servers', value: `${totalGuilds.toLocaleString()}`, inline: true },
                                { name: 'Users', value: `${totalMembers.toLocaleString()}`, inline: true },
                                { name: 'Players', value: `${totalPlayingPlayers.toLocaleString()}/${totalPlayers.toLocaleString()}`, inline: true },
                                { name: 'CPU usage', value: `${percent.toFixed(2)}%`, inline: true },
                                { name: 'Commands Used', value: `${b.commandsUsed.toLocaleString()}`, inline: true },
                                { name: 'Songs Played', value: `${b.songsPlayed.toLocaleString()}`, inline: true },
                                { name: 'Memory Usage', value: `\`\`\`RSS: ${totalRSS.toLocaleString().replace(/^0+(?!\.|$)/, '')} | ${totalMemory.toLocaleString().replace(/^0+(?!\.|$)/, '')} / ${(os.totalmem() / 1024 / 1024).toLocaleString().replace(/^0+(?!\.|$)/, '')} MB | ${memoryPercentage}% used\`\`\`` },
                                { name: 'Uptime', value: `\`\`\`${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds\`\`\`` },
                            )
                            .setFooter({ name: `Latency ${msg.createdTimestamp - ctx.createdTimestamp}ms` })
                            .setTimestamp();
                        return ctx.editMessage({ content: null, embeds: [statsEmbed] });
                    });
                })
                .catch(err => client.logger.error(err));
        });
    }
};