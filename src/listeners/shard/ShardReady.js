const Event = require('../../structures/Event');

module.exports = class ShardReady extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(shardID) {
        this.client.logger.ready('Shard %d ready', shardID);
    }
};