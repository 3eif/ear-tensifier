const Event = require('../../structures/Event');
const fs = require('fs');

module.exports = class Debug extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(log) {
		if (!fs.existsSync('./src/logs/debug.log')) fs.writeFileSync('./src/logs/debug.log', '');
		fs.appendFileSync('./src/logs/debug.log', `${log}\n`);
	}
};
