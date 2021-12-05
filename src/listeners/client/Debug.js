const fs = require('fs');

const Event = require('../../structures/Event');

module.exports = class Debug extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(log) {
        // TODO: FIX THIS
        if (!fs.existsSync('./src/logs')) fs.mkdirSync('./src/logs');
        if (!fs.existsSync('./src/logs/debug.log')) fs.writeFileSync('./src/logs/debug.log', '');

        fs.appendFileSync('./src/logs/debug.log', `${log}\n`);
    }
};
