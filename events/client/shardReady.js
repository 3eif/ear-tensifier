const Event = require('../../structures/Event');

module.exports = class ShardReady extends Event {
    constructor(...args) {
        super(...args)
    }

    async run() {
        let i = parseInt(this.client.shard.ids) + 1;
        console.log(`Shard [${i}] ready`)
    }
}