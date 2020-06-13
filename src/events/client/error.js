const Event = require('../../structures/Event');

module.exports = class Error extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(error) {
        this.client.log(error);
	}
};