const { post } = require('../tokens.json');
const { ddblAPI } = require('ddblapi.js');
const ddbl = new ddblAPI(post["divinediscordbots"]["id"], post["divinediscordbots"]["token"]);

module.exports = async (client, servers, shards, shardID, users) => {
    ddbl.postStats(servers)
    .then(console.log(`Posted bot stats to divinediscordbots.js`));
}