const BotList = require('botlist.space');
const { post } = require('../../tokens.json');
const botListClient = new BotList.Client({ id: post['botListSpace']['id'], botToken: post['botListSpace']['token'] });

module.exports = async (client) => {
	const shardInfo = await client.shard.broadcastEval(`[
        this.guilds.cache.size,
      ]`);

	const shardArray = [];
	shardInfo.forEach(i => {
		shardArray.push(i[0]);
	});

	botListClient.postServerCount(shardArray).then(() => {
		client.log('Posted bot stats to botlist.api');
	}).catch((error) => client.log('An error occured while posting bot stats to botlist.space: ' + error));
};