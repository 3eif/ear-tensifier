const Event = require('../../structures/Event');

module.exports = class TrackEnd extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(error) {
        this.client.logger.error(error);
    }
};