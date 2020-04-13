const Event = require('../../structures/Event');

module.exports = class ShardReady extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(e) {
		const i = parseInt(this.client.shard.ids) + 1;
		this.client.log(`[Shard ${i}] Error ${e}...`);
	}
};