const { Source } = require('node-ffplayer');
const { Collection } = require('discord.js');
const EventEmitter = require('events');

module.exports = class Manager extends EventEmitter {
    constructor() {
        super();
        this.players = new Collection();
    }

    get(guildId) {
        return this.players.get(guildId);
    }

    destroy(guildId) {
        this.players.delete(guildId);
    }

    search(query, requester) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            let track = await Source.resolve(query);
            if (!track) track = await Source.Youtube.search(query)[0];

            if (!track) return reject(new Error('No track found'));
            else return resolve(track);
        });
    }
}