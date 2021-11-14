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
                switch (message.cluster) {
                    case 'all':
                        this.logger.warn('Rebooting all clusters');
                        sharder.clusters.forEach(c => c.kill());
                        sharder.spawn();
                        break;
                    default:
                        this.logger.warn('Rebooting cluster %d', message.cluster);
                        sharder.clusters.get(Number(message.cluster)).respawn();
                        break;
                }
                break;
            default:
                this.logger.error('Unknown message type: %s', message.type);
                break;
        }
    }
};