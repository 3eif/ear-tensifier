const Event = require('../../structures/Event');
const chalk = require('chalk');

module.exports = class ShardReady extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(e) {
		const i = parseInt(this.client.shard.ids, 10) + 1;
		this.client.log(chalk.red(`[Shard ${i}] Error ${e}...`));
	}
};