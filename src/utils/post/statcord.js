const Statcord = require('statcord.js-beta');

module.exports = async (client) => {
    Statcord.ShardingClient.post(client);
    setInterval(function() {
        Statcord.ShardingClient.post(client);
    }, 60000);
};