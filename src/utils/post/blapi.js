const blapi = require('blapi');
const botLists = require('../../../config/botlists.json');

module.exports = async (client, servers, shards, shardCount) => {
    post();
    setInterval(function() {
        post();
    }, 1800000);

    function post() {
        blapi.setLogging(true);
        blapi.manualPost(servers, client.user.id, botLists, null, shardCount, shards);
        client.log('Posted bot stats to bot lists.');
    }
};