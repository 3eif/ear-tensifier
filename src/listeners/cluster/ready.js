const Manager = require('../../structures/Manager');
const Event = require('../../structures/Event');

module.exports = class Ready extends Event {
    constructor(...args) {
        super(...args);
    }

    async run() {
        this.client.logger.ready('Cluster %d ready', this.client.shard.id);

        this.client.music = new Manager()
            .on('ready', (player) => { console.log(player); });

        if (this.client.shard.id == this.client.shard.clusterCount - 1) {
            this.client.logger.ready('Ear Tensifier is ready');
        }
    }
};