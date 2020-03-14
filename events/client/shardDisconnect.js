const Event = require('../../structures/Event');

module.exports = class ShardReady extends Event {
    constructor(...args) {
        super(...args)
    }

    async run() {
        console.log("Disconnecting...")
    }
}