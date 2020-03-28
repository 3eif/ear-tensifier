const Event = require('../../structures/Event');

module.exports = class Raw extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(log) {
        require('fs').appendFileSync('debug.log', `${log}`);
	}
};