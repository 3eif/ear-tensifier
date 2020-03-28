const Event = require('../../structures/Event');

module.exports = class Raw extends Event {
	constructor(...args) {
		super(...args);
	}

	async run() {
		console.log(this.client.events.push({ timestamp: Date.now() }));
	}
};