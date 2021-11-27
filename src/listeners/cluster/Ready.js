const Event = require('../../structures/Event');
const Manager = require('../../structures/Manager');

module.exports = class Ready extends Event {
    constructor(...args) {
        super(...args);
    }

    async run() {
        this.client.logger.ready('Cluster %d ready', this.client.shard.id);

        this.client.music = new Manager();
        this.client.loadPlayerListeners();

        if (this.client.shard.id == this.client.shard.clusterCount - 1) {
            this.client.logger.ready('Ear Tensifier is ready');

            if (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'development') {
                try {
                    require('../../api/index.js')(this.client);
                }
                catch (err) {
                    this.client.logger.error(err.message);
                }
            }
        }
    }
};