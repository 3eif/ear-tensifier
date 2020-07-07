const figlet = require('figlet');
const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const chalk = require('chalk');

const Event = require('../../structures/Event');
const player = require('../../player/player.js');
const postHandler = require('../../handlers/post.js');
const { Manager } = require('lavaclient');
const { QueuePlugin } = require('lavaclient-queue');

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
		const client = this.client;
		// player(client);
		// const music = client.music.init(client.user.id);
		// await client.music.init(client.user.id)
		// .on('socketError', ({ id }, error) => console.error(`${id} ran into an error`, error))
		// .on('socketReady', (node) => console.log(`${node.id} connected.`));

		const nodes = [
			{
				id: 'main',
				host: process.env.LAVALINK_HOST,
				port: process.env.LAVALINK_PORT,
				password: process.env.LAVALINK_PASSWORD,
			},
		];

		client.music = new Manager(nodes, {
			shards: client.shard.count,
			send(id, data) {
				const guild = client.guilds.cache.get(id);
				if (guild) guild.shard.send(data);
				return;
			},
		});
		client.music.use(new QueuePlugin());
		await client.music.init(client.user.id);
		client.music.on('socketError', ({ id }, error) => console.error(`${id} ran into an error`, error));
		client.music.on('socketReady', (node) => console.log(`${node.id} connected.`));
		client.ws.on('VOICE_STATE_UPDATE', (upd) => client.music.stateUpdate(upd));
		client.ws.on('VOICE_SERVER_UPDATE', (upd) => client.music.serverUpdate(upd));

		const status = 'ear help';
		const statusType = 'LISTENING';
		client.user.setActivity(`${status}`, { type: `${statusType}` });

		if (client.shard.ids[0] == client.shard.count - 1) {

			const guildNum = await client.shard.fetchClientValues('guilds.cache.size');
			const memberNum = await client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)');
			const totalMembers = memberNum.reduce((prev, memberCount) => prev + memberCount, 0);
			const totalGuilds = guildNum.reduce((total, shard) => total + shard, 0);

			figlet(client.user.username, function(err, data) {
				if (err) {
					console.log('Something went wrong...');
					console.dir(err);
					return;
				}
				console.log(chalk.magenta.bold(data));
			});

			client.log(chalk.magenta.underline.bold(`Ear Tensifier is online: ${client.shard.count} shards, ${totalGuilds} servers and ${totalMembers} members.`));

			if (client.user.id == '472714545723342848') {
				postHandler(client, totalGuilds, guildNum, client.shard.count);
				require('../../utils/voting/blsHook.js').startUp(client);
				require('../../utils/voting/dblHook.js').startUp(client);
			}
		}
	}
};

