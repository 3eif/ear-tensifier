const Event = require('../../structures/Event');

class Error extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(e) {
        this.client.logger.error('FATAL ERROR OH NO!!!', e.stack);
    }
}
module.exports = Error;
