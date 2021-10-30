const Event = require('../../structures/Event');

module.exports = class Spawn extends Event {
    constructor(...args) {
        super(...args);
    }

    async run() {
        this.client.logger.success('Spawned %d cluster', this.client.shard.id);
    }
};