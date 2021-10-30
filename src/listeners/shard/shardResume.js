const Event = require('../../structures/Event');

module.exports = class ShardResume extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(shardID) {
        this.client.logger.awaiting('Shard %d resuming', shardID);
    }
};