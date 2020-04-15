/* eslint-disable no-unused-vars */
module.exports = async (client, channelID, message) => {
    if (typeof message === 'object') return client.shard.broadcastEval(`this.channels.cache.get("${channelID}").send({ embed: ${JSON.stringify(message.toJSON(), null, 4)} });`);
    else return client.shard.broadcastEval(`this.channels.cache.get("${channelID}").send(message);`);
};