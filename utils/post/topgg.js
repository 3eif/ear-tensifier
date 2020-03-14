const { post } = require('../../tokens.json');
const DBL = require("dblapi.js");

module.exports = async (client, servers, shards, shardID, users) => {
    const dbl = new DBL(post["topGG"]["token"], client);
    dbl.postStats(servers, shardID, shards);
}