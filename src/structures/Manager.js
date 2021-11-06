const { Source } = require('yasha');
const { Collection } = require('discord.js');
const EventEmitter = require('events');

const Player = require('../structures/Player');

module.exports = class Manager extends EventEmitter {
    constructor() {
        super();
        this.players = new Collection();
    }

    newPlayer(guild, voiceChannel, textChannel) {
        const player = new Player({
            manager: this,
            guild: guild,
            voiceChannel: voiceChannel,
            textChannel: textChannel,
        });

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

        return player;
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
            return;
        }

        if (track && player.queueRepeat) {
            player.queue.add(player.queue.current);
            player.queue.current = player.queue.shift();

            this.emit('trackEnd', player, track);
            player.play();
            return;
        }

        if (player.queue.length > 0) {
            player.queue.previous.push(track);
            player.queue.current = player.queue.shift();

            this.emit('trackEnd', player, track);
            player.play();
            return;
        }

        if (!player.queue.length) return this.queueEnd(player, track);
    }

    queueEnd(player, track) {
        this.emit('queueEnd', player, track);
        player.destroy();
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