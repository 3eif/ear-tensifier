const BotList = require('botlist.space');
const { post } = require('../../tokens.json');
const botListClient = new BotList.Client({ id: post["botListSpace"]["id"], botToken: post["botListSpace"]["token"] });

module.exports = async (client, servers, shards) => {
    var shardInfo = await client.shard.broadcastEval(`[
        this.guilds.cache.size,
      ]`)

    let shardArray = [];
    shardInfo.forEach(i => {
        shardArray.push(i[0]);
    })

    botListClient.postServerCount(shardArray).then((client) => {
        console.log("Posted bot stats to botlist.api")
    }).catch((error) => console.log("An error occured while posting bot stats to botlist.space: " + error));
}