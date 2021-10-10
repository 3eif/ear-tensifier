const figlet = require('figlet');
const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const chalk = require('chalk');
const Statcord = require('statcord.js');
const Event = require('../../structures/Event');
const createManager = require('../../player/createManager.js');
const post = require('../../handlers/post.js');
const blapi = require('blapi');

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
		createManager(this.client);
		this.client.music.init(this.client.user.id);

		const status = `${this.client.settings.prefix}help`;
		const statusType = 'LISTENING';
		this.client.user.setActivity(`${status}`, { type: `${statusType}` });

		if (this.client.shard.ids[0] == this.client.shard.count - 1) {
			const guildNum = await this.client.shard.fetchClientValues('guilds.cache.size');
			const memberNum = await this.client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)');
			const totalMembers = memberNum.reduce((prev, memberCount) => prev + memberCount, 0);
			const totalGuilds = guildNum.reduce((total, shard) => total + shard, 0);

			figlet(this.client.user.username, function (err, data) {
				if (err) {
					console.log('Something went wrong...');
					console.dir(err);
					return;
				}
				console.log(chalk.magenta.bold(data));
			});

			this.client.log(chalk.magenta.underline.bold(`${this.client.user.username} is online: ${this.client.shard.count} shards, ${totalGuilds} servers and ${totalMembers} members.`));

			if (this.client.user.id == '472714545723342848') {
				Statcord.ShardingClient.post(this.client);

				setInterval(async function () {
					Statcord.ShardingClient.post(this.client);
				}, 1800000);

				require('../../webhooks/blsHook.js').startUp(this.client);
				require('../../webhooks/dblHook.js').startUp(this.client);

				blapi.setLogging({
					extended: true
				});
				blapi.manualPost(totalGuilds, this.client.user.id, require('../../../config/botlists.json'), null, this.client.shard.count, null);
				this.client.log('Posted bot stats to blapi.');
			}
		}
	}
};

