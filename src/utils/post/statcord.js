const Statcord = require('statcord.js');

module.exports = async (client) => {
    Statcord.ShardingClient.post(client);
};