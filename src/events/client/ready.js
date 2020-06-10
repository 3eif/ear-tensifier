/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const figlet = require('figlet');
const blapi = require('blapi');
const mongoose = require('mongoose');
const Sentry = require('@sentry/node');

const Event = require('../../structures/Event');
const player = require('../../player/player.js');
const postHandler = require('../../handlers/post.js');
const botLists = require('../../../config/botlists.json');

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

					// blapi.setLogging(true);
					// blapi.handle(this.client, botLists, 30);
					// console.log('t');

					const status = 'ear help';
					const statusType = 'LISTENING';
					this.client.shard.broadcastEval(`this.user.setActivity('${status}', { type: '${statusType}' })`);

					if (this.client.user.id != '472714545723342848') return;
					require('../../utils/voteHook.js').startUp(this.client);
					postHandler(this.client, totalGuilds, this.client.shard.count);
					require('../../utils/dbl.js').startUp(this.client);
				});
		}
	}
};

