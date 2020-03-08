const { post } = require('../tokens.json');
const DBL = require("dblapi.js");

module.exports = async (client, servers, shards, shardID, users) => {
    const dbl = new DBL(post["topGG"]["token"], client);
    dbl.on('posted', () => {
        console.log('Posted bot stats to top.gg');
    })

    dbl.on('error', e => {
        console.log(`Oops! ${e}`);
    })
}