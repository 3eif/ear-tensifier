const Event = require('../../structures/Event');

module.exports = class Raw extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(log) {
        require('fs').appendFileSync('./src/logs/debug.log', `${log}`);
	}
};