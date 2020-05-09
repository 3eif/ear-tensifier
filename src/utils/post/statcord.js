const statcord = require('statcord.js');

module.exports = async (client) => {
    const statclient = new statcord(process.env.STATCORD_TOKEN, client);
    await statclient.autoPost();
};