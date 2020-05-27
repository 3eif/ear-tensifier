/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const figlet = require('figlet');
const mongoose = require('mongoose');
const Sentry = require('@sentry/node');

const Event = require('../../structures/Event');
const player = require('../../player/player.js');
const postHandler = require('../../handlers/post.js');

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

Sentry.init({
	dsn: process.env.SENTRY_URL,
	environment: process.env.SENTRY_ENVIRONMENT,
});

module.exports = class Ready extends Event {
	constructor(...args) {
		super(...args);
	}

	async run() {
		player(this.client);

		this.client.levels = new Map()
			.set('none', 0.0)
			.set('low', 0.1)
			.set('medium', 0.15)
			.set('high', 0.25);

		this.client.user.setActivity('ear help', { type: 'LISTENING' });

		if (this.client.shard.ids[0] == this.client.shard.count - 1) {

			const promises = [
				this.client.shard.fetchClientValues('guilds.cache.size'),
				this.client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
			];

			return Promise.all(promises)
				.then(async results => {
					const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
					const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

					figlet(this.client.user.username, function(err, data) {
						if (err) {
							console.log('Something went wrong...');
							console.dir(err);
							return;
						}
						console.log(data);
					});

					this.client.log(`Ear Tensifier is online: ${this.client.shard.count} shards, ${totalGuilds} servers and ${totalMembers} members.`);

					// const embed = new Discord.MessageEmbed()
					// 	.setAuthor('Ear Tensifier', this.client.settings.avatar)
					// 	.setColor(this.client.colors.main)
					// 	.setDescription('Ear Tensifier is online.')
					// 	.addField('Shards', `**${this.client.shard.count}** shards`, true)
					// 	.addField('Servers', `**${totalGuilds}** servers`, true)
					// 	.setTimestamp()
					// 	.setFooter(`${totalMembers} users`);

					// this.client.shardMessage(this.client, this.client.channelList.readyChannel, embed);

					if (this.client.user.id != '472714545723342848') return;
					postHandler(this.client, totalGuilds, this.client.shard.count);
					require('../../utils/dbl.js').startUp(this.client);
				});
		}
	}
};

