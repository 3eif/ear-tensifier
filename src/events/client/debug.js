const Event = require('../../structures/Event');

module.exports = class Debug extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(log) {
        require('fs').appendFileSync('./src/logs/debug.log', `${log}`);
	}
};