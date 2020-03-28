const Event = require('../../structures/Event');

module.exports = class Raw extends Event {
	constructor(...args) {
		super(...args);
	}

	async run() {
		this.client.events.push({ timestamp: Date.now() });
	}
};