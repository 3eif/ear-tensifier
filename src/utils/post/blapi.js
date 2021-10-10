const blapi = require('blapi');

module.exports = async (client, servers, shardCount) => {
    blapi.setLogging({
        extended: true
    });
    blapi.manualPost(servers, client.user.id, require('../../../config/botlists.json'), null, shardCount, null);
    client.log('Posted bot stats to blapi.');
};