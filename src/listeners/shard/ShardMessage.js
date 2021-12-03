const Event = require('../../structures/Event');

module.exports = class ShardMessage extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(originShard, message, manager, logger) {
        if (!originShard || !message) return;
        switch (message.type) {
            case 'shutdown':
                switch (message.shard) {
                    case 'all':
                        logger.warn('Shutting down all shards');
                        for (const shard of manager.shards.values()) {
                            shard.kill();
                            process.exit();
                        }
                        break;
                    default:
                        logger.warn('Shutting down shard %d', message.shard);
                        // eslint-disable-next-line no-case-declarations
                        const shard = manager.shards.get(message.shard);
                        if (shard) shard.kill();
                        break;
                }
                break;
            case 'reboot':
                switch (message.shard) {
                    case 'all':
                        logger.warn('Rebooting all shards');
                        for (const shard of manager.shards.values()) {
                            shard.respawn();
                        }
                        break;
                    default:
                        logger.warn('Rebooting shard %d', message.shard);
                        // eslint-disable-next-line no-case-declarations
                        const shard = manager.shards.get(message.shard);
                        if (shard) shard.respawn();
                        break;
                }
                break;
            default:
                // logger.error('Unknown message type: %s', message.type);
                break;
        }
    }
};