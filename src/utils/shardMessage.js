/* eslint-disable no-unused-vars */
module.exports = async (client, channel, message) => {
    await client.shard.broadcastEval(`
    if(this.channels.cache.find(c => c.id === channel.id)){
    this.channels.cache.find(c => c.id === channel.id).send(message);
    `);
};