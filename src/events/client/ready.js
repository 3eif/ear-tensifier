const figlet = require('figlet');
const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const blapi = require('blapi');

const botLists = require('../../../config/botlists.json');
const Event = require('../../structures/Event');
const player = require('../../player/player.js');

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
		this.client.music.init(this.client.user.id);

		if (this.client.shard.ids[0] == this.client.shard.count - 1) {

			const guildNum = await this.client.shard.fetchClientValues('guilds.cache.size');
			const memberNum = await this.client.shard.fetchClientValues('guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)');
			const totalMembers = memberNum.results.reduce((prev, memberCount) => prev + memberCount, 0);
			const totalGuilds = guildNum.reduce((total, shard) => total + shard, 0);

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

			const status = 'ear help';
			const statusType = 'LISTENING';
			this.client.shard.broadcastEval(`this.user.setActivity('${status}', { type: '${statusType}' })`);

			if (this.client.user.id == '472714545723342848') {
				blapi.manualPost(totalGuilds, this.client.user.id, botLists, null, guildNum.length, guildNum);
				require('../../utils/voteHook.js').startUp(this.client);
				require('../../utils/dbl.js').startUp(this.client);
			}
		}
	}
};

