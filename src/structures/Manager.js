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

        player.on('error', (err) => {
            this.emit('error', err);
        });
    }

    trackStart(player) {
        player.playing = true;
        player.paused = false;

        const track = player.queue.current;
        this.emit('trackStart', player, track);
    }

    trackEnd(player) {
        const track = player.queue.current;

        if (track && player.trackRepeat) {
            this.emit('trackEnd', player, track);
            player.play();
        }

        if (track && player.queueRepeat) {
            player.queue.add(player.queue.current);
            player.queue.current = player.queue.shift();

            this.manager.emit('trackEnd', player, track);
            player.play();
        }

        if (player.queue.length > 0) {
            player.queue.previous.push(track);
            player.queue.current = player.queue.shift();
            player.play();
            this.emit('trackEnd', player, track);
        }

        if (!player.queue.length) return this.queueEnd(player, track);
    }

    get(guild) {
        return this.players.get(guild.id);
    }

    destroy(guild) {
        this.players.delete(guild.id);
    }

    async search(query, requester) {
        let track = await Source.resolve(query);

        if (!track) track = (await Source.Youtube.search(query))[0];

        if (!track) throw new Error('No track found');
        else return track;
    }
};