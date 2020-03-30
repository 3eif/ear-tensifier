/* eslint-disable no-shadow */
const discordbots = require('discord.bots.gg');
const { post } = require('../../tokens.json');
const dbots = new discordbots(post['discordBotsGG']['id'], post['discordBotsGG']['token']);

module.exports = async (client, servers, shards, shardID) => {
	// eslint-disable-next-line no-unused-vars
	dbots.postStats(servers, shards, shardID).then((client) => {
		console.log('Posted bot stats to discordbots.gg');
	}).catch((error) => console.log('An error occured while posting bot stats to discordbots.gg: ' + error));
};