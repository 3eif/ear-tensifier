const Event = require('../../structures/Event');

module.exports = class Raw extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(r) {
        this.client.music.updateVoiceState(r);
	}
};