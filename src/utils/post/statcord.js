const Statcord = require('statcord.js-beta');

module.exports = async (client) => {
    setInterval(function() {
        Statcord.ShardingClient.post(client);
    }, 1800000);
};