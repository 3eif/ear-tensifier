const mongoose = require('mongoose');

const Event = require('../../structures/Event');
const Manager = require('../../structures/Manager');

module.exports = class Ready extends Event {
    constructor(...args) {
        super(...args);
    }

    async run() {
        if (process.env.MONGO_URL) {
            mongoose.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }).then(() => this.client.logger.complete('Connected to MongoDB'));
        }
        else this.client.logger.warn('MongoDB URL missing');

        const status = `${this.client.config.prefix}help`;
        const statusType = 'LISTENING';
        this.client.user.setActivity(`${status}`, { type: `${statusType}` });

        this.client.music = new Manager();
        this.client.loadPlayerListeners();

        if (this.client.shard.ids[0] == this.client.shard.count - 1) {
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