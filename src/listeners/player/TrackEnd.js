const Event = require('../../structures/Event');

module.exports = class TrackEnd extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(player, track) {
        player.queue.previous.push(track);
    }
};