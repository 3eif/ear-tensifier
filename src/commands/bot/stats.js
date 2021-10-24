const Command = require('../../structures/Command');

const { MessageEmbed } = require('discord.js');
const cpuStat = require('cpu-stat');
const os = require('os');

const bot = require('../../models/bot.js');

class Stats extends Command {
	constructor(client) {
		super(client, {
			name: 'stats',
			description: 'Displays the bot\'s stats',
			usage: '',
			enabled: true,
			cooldown: 5,
			args: false,
		});
	}
	async run(client, message) {
		const msg = await message.channel.send(`${client.emojiList.loading} Gathering stats...`);

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
			id: c.shard.ids,
			status: c.shard.mode,
			guilds: c.guilds.cache.size,
			channels: c.channels.cache.size,
			users: c.users.cache.size,
			heapUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
			players: c.music.nodes.array()[0].stats.players,
			ping: c.ws.ping,
			rss: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
			playingPlayers: c.music.nodes.array()[0].stats.playingPlayers,
		}));

		const totalMusicStreams = client.music.nodes.array()[0].stats.players;
		const playingMusicStreams = client.music.nodes.array()[0].stats.playingPlayers;

		bot.findOne({
			clientID: client.user.id,
		}, async (err, b) => {
			if (err) client.log(err);
			Promise.all(promises)
				.then(results => {
					const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
					const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

					let totalMemory = 0;
					shardInfo.forEach(s => totalMemory += s.heapUsed);
					let totalRSS = 0;
					shardInfo.forEach(s => totalRSS += s.rss);
					let avgLatency = 0;
					shardInfo.forEach(s => avgLatency += s.ping);
					avgLatency = avgLatency / shardInfo.length;
					avgLatency = Math.round(avgLatency);
					const memoryPercentage = ((totalMemory / (os.totalmem() / 1024 / 1024)).toFixed(3) * 100).toFixed(2);

					cpuStat.usagePercent(function (err, percent) {
						const statsEmbed = new MessageEmbed()
							.setAuthor('Ear Tensifier')
							.setColor(client.colors.main)
							.setThumbnail(client.settings.avatar)
							.addField('Born On', new Date(client.user.createdAt).toLocaleString('en-US', { timezone: 'America/Los_Angeles' }, true) + " Pacific Standard Time")
							.addField('Current Version', client.settings.version, true)
							.addField('Servers', `${totalGuilds.toLocaleString()} servers`, true)
							.addField('Users', `${totalMembers.toLocaleString()} users`, true)
							.addField('Shards', `${parseInt(client.shard.ids) + 1}/${client.shard.count}`, true)
							.addField('CPU usage', `${percent.toFixed(2)}%`, true)
							.addField('Commands Used', `${b.commandsUsed.toLocaleString()}`, true)
							.addField('Songs Played', `${b.songsPlayed.toLocaleString()}`, true)
							.addField('Players', `${totalMusicStreams.toLocaleString()}`, true)
							.addField('Playing Players', `${playingMusicStreams.toLocaleString()}`, true)
							.addField('Memory Used', `\`\`\`${totalRSS.toLocaleString().replace(/^0+(?!\.|$)/, '')} RSS | ${totalMemory.toLocaleString().replace(/^0+(?!\.|$)/, '')} / ${(os.totalmem() / 1024 / 1024).toLocaleString().replace(/^0+(?!\.|$)/, '')} MB | ${memoryPercentage}% used\`\`\``)
							.addField('Uptime', `\`\`\`${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds\`\`\``)
							.setFooter(`Latency ${msg.createdTimestamp - message.createdTimestamp}ms`)
							.setTimestamp();
						return msg.edit({ content: ' ', embeds: [statsEmbed] });
					});
				})
				.catch(console.error);
		});
	}
}

module.exports = Stats;