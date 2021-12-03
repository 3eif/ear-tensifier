const Event = require('../../structures/Event');
const ShardMessage = require('./ShardMessage');

module.exports = class ShardCreate extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(shard, manager, logger) {
        logger.ready('Shard %d created', shard.id);
        shard.on('message', (message) => (new ShardMessage(null, ShardMessage)).run(shard, message, manager, logger));
    }
};