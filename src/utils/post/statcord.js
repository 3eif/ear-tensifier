/* eslint-disable no-unused-vars */
const statcord = require('statcord.js');

module.exports = async (client, servers, shards, shardID) => {
    const statClient = new statcord(process.env.STATCORD_KEY, client, true, true);
    const req = statClient.post();
    console.log(req.body);
};