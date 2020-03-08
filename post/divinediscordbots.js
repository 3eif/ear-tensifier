const { post } = require('../tokens.json');
const { ddblAPI } = require('ddblapi.js');
const ddbl = new ddblAPI(post["divineDiscordBots"]["id"], post["divineDiscordBots"]["token"]);

module.exports = async (client, servers, shards, shardID, users) => {
    ddbl.postStats(servers)
    .then(console.log(`Posted bot stats to divinediscordbots.js`));
}