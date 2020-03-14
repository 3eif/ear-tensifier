const GBL = require('gblapi.js');
const { post } = require('../../tokens.json');
const Glenn = new GBL(post["glenBotListXYZ"]["id"], post["glenBotListXYZ"]["token"]); // Use your bot's user id and GBL Auth Token

module.exports = async (client, servers, shards, shardID, users) => {
    Glenn.updateStats(servers).then(console.log("Posted bot stats to glennbotlist.xyz"));
}