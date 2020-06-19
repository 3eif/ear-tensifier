const Discord = require('discord.js');

const Command = require('../../structures/Command');

module.exports = class Shards extends Command {
	constructor(client) {
		super(client, {
			name: 'shards',
			description: 'Displays the bot\'s shards',
			cooldown: '5',
			aliases: ['shardstats', 'shardinfo'],
			usage: '',
			enabled: true,
			args: false,
		});
	}
	async run(client, message) {

		const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
		];

		const shardInfo = await client.shard.broadcastEval(`[
        this.shard.ids,
        this.shard.mode,
        this.guilds.cache.size,
        this.channels.cache.size,
        this.users.cache.size,
        (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
		this.music.players.size,
		this.ws.ping
      ]`);

		const embed = new Discord.MessageEmbed()
			.setColor(client.colors.main)
			.setAuthor('Ear Tensifier', client.user.displayAvatarURL());

		let totalMusicStreams = 0;
		shardInfo.forEach(i => {
			const status = i[1] === 'process' ? client.emojiList.online : client.emojiList.offline;
			embed.addField(`${status} Shard ${(parseInt(i[0]) + 1).toString()}`, `\`\`\`js
Servers: ${i[2]}\nChannels: ${i[3]}\nUsers: ${i[4]}\nMemory: ${i[5]} MB\nAPI: ${i[7]} ms\nPlayers: ${i[6]}\`\`\``, true);
			totalMusicStreams += i[6];
		});

		Promise.all(promises)
			.then(results => {
				let totalMemory = 0;
				shardInfo.forEach(s => totalMemory += parseInt(s[5]));
				let totalChannels = 0;
				shardInfo.forEach(s => totalChannels += parseInt(s[3]));
				let avgLatency = 0;
				shardInfo.forEach(s => avgLatency += s[7]);
				avgLatency = avgLatency / shardInfo.length;
				avgLatency = Math.round(avgLatency);
				const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
				const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

				embed.addField(client.emojiList.online + ' Total Stats', `\`\`\`js
Total Servers: ${totalGuilds.toLocaleString()}\nTotal Channels: ${totalChannels.toLocaleString()}\nTotal Users: ${totalMembers.toLocaleString()}\nTotal Memory: ${totalMemory.toFixed(2)} MB\nAvg. API Latency: ${avgLatency} ms\nTotal Players: ${totalMusicStreams}\`\`\``);
				embed.setTimestamp();
				message.channel.send(embed);
			});
	}
};
