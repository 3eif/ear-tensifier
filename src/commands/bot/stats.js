const Discord = require('discord.js');
const bot = require('../../models/bot.js');

module.exports = {
	name: 'stats',
	description: 'Displays the bot\'s stats',
	cooldown: '5',
	async execute(client, message) {

		const msg = await message.channel.send(`${client.emojiList.loading} Gathering stats...`);
		const used = process.memoryUsage().heapUsed / 1024 / 1024;
		const totalSeconds = process.uptime();
		const realTotalSecs = Math.floor(totalSeconds % 60);
		const days = Math.floor((totalSeconds % 31536000) / 86400);
		const hours = Math.floor((totalSeconds / 3600) % 24);
		const mins = Math.floor((totalSeconds / 60) % 60);

		const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
		];

		bot.findOne({
			clientID: client.user.id,
		}, async (err, b) => {
			if (err) console.log(err);
			Promise.all(promises)
				.then(results => {
					const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
					const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

					const statsEmbed = new Discord.MessageEmbed()
						.setAuthor('Ear Tensifier', client.user.displayAvatarURL())
						.setColor(client.colors.main)
						.setThumbnail(client.settings.avatar)
						.addField('Born On', client.user.createdAt)
						.addField('Current Version', client.settings.version, true)
						.addField('Servers', `${totalGuilds} servers`, true)
						.addField('Members', `${totalMembers} members`, true)
						.addField('Shards', `${parseInt(client.shard.ids) + 1}/${client.shard.count}`, true)
						.addField('Memory Used', `${Math.round(used * 100) / 100}MB`, true)
						.addField('Messages Sent', `${b.messagesSent} messages`, true)
						.addField('Songs Played', `${b.songsPlayed} songs`, true)
						.addField('Uptime', `${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds`)
						.setFooter(`Latency ${msg.createdTimestamp - message.createdTimestamp}ms`)
						.setTimestamp();
					return msg.edit('', statsEmbed);
				})
				.catch(console.error);
		});
	},
};