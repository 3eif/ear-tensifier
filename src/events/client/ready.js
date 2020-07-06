const figlet = require('figlet');
const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const chalk = require('chalk');

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
		await this.client.music.init(this.client.user.id)
		.on('socketError', ({ id }, error) => console.error(`${id} ran into an error`, error))
		.on('socketReady', (node) => console.log(`${node.id} connected.`));

		const status = 'ear help';
		const statusType = 'LISTENING';
		this.client.user.setActivity(`${status}`, { type: `${statusType}` });

		if (this.client.shard.ids[0] == this.client.shard.count - 1) {

			const guildNum = await this.client.shard.fetchClientValues('guilds.cache.size');
			const memberNum = await this.client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)');
			const totalMembers = memberNum.reduce((prev, memberCount) => prev + memberCount, 0);
			const totalGuilds = guildNum.reduce((total, shard) => total + shard, 0);

			figlet(this.client.user.username, function(err, data) {
				if (err) {
					console.log('Something went wrong...');
					console.dir(err);
					return;
				}
				console.log(chalk.magenta.bold(data));
			});

			this.client.log(chalk.magenta.underline.bold(`Ear Tensifier is online: ${this.client.shard.count} shards, ${totalGuilds} servers and ${totalMembers} members.`));

			if (this.client.user.id == '472714545723342848') {
				postHandler(this.client, totalGuilds, guildNum, this.client.shard.count);
				require('../../utils/voting/blsHook.js').startUp(this.client);
				require('../../utils/voting/dblHook.js').startUp(this.client);
			}
		}
	}
};

