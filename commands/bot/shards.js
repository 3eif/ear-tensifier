const Discord = require('discord.js');

module.exports = {
	name: 'shards',
	description: 'Displays the bot\'s shards',
	cooldown: '5',
	aliases: ['shardstats', 'shardinfo'],
	async execute(client, message) {

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
        this.music.players.size
      ]`);

		const embed = new Discord.MessageEmbed()
			.setColor(client.colors.main)
			.setAuthor('Ear Tensifier', client.user.displayAvatarURL());

		let totalMusicStreams = 0;
		shardInfo.forEach(i => {
			const status = i[1] === 'process' ? client.emojiList.online : client.emojiList.offline;
			embed.addField(`${status} Shard ${i[0]}`, `\`\`\`js
Servers: ${i[2]}\nChannels: ${i[3]}\nUsers: ${i[4]}\nMemory: ${i[5]} mb\nMusic Streams: ${i[6]}\`\`\``, true);
			totalMusicStreams += i[6];
		});

		Promise.all(promises)
			.then(results => {
				const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
				const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
				embed.addField('Total Stats', `**${totalGuilds}** servers - **${totalMembers}** members - **${totalMusicStreams}** music streams`);
				message.channel.send(embed);
			});
	},
};