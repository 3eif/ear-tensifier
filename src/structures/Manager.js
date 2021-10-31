const { Source } = require('yasha');
const { Collection } = require('discord.js');
const EventEmitter = require('events');

module.exports = class Manager extends EventEmitter {
    constructor() {
        super();
        this.players = new Collection();
    }

    newPlayer(player) {
        this.players.set(player.guild.id, player);

        player.on('ready', () => {
            this.trackStart(player);
        });

        player.on('finish', () => {
            this.trackEnd(player);
        });
    }

    trackStart(player) {
        player.playing = true;
        player.paused = false;
        this.emit('trackStart', (player));
    }

    trackEnd(player) {
        if (player.queue.length) {
            player.queue.previous.push(player.queue.current);
            player.queue.current = player.queue.shift();
            player.play();
            this.emit('trackEnd', player);
        }
    }

    get(guild) {
        return this.players.get(guild.id);
    }

    destroy(guild) {
        this.players.delete(guild.id);
    }

    async search(query, requester) {
        let track = await Source.resolve(query);
        if (!track) track = await Source.Youtube.search(query)[0];

        if (!track) throw new Error('No track found');
        else return track;
    }
}