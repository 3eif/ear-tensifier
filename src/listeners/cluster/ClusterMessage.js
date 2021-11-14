const Event = require('../../structures/Event');
const Logger = require('../../structures/Logger');

module.exports = class ClusterMessage extends Event {
    constructor(...args) {
        super(...args);
        this.logger = new Logger({
            displayTimestamp: true,
            displayDate: true,
        });
    }

    async run(sharder, message) {
        switch (message.type) {
            case 'shutdown':
                switch (message.cluster) {
                    case 'all':
                        this.logger.warn('Shutting down all clusters');
                        sharder.clusters.forEach(cluster => {
                            cluster.kill();
                            process.exit();
                        });
                        break;
                    default:
                        this.logger.warn('Shutting down clusters %d', message.cluster);
                        sharder.clusters.get(Number(message.cluster)).kill();
                }
                break;
            case 'reboot':
                switch (message.shard) {
                    case 'all':
                        this.logger.warn('Rebooting all shards');
                        this.client.shard.restartAll();
                        break;
                    default:
                        this.logger.warn('Rebooting shard %d', message.shard);
                        this.client.shard.restart(message.shard);
                        break;
                }
                break;
            default:
                this.logger.warn('Unknown message type: %s', message.type);
                break;
        }
    }
};