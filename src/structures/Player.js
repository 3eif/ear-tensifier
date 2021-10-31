const { TrackPlayer } = require('yasha');

const Queue = require('./Queue');

module.exports = class Player extends TrackPlayer {

    constructor(options) {
        super();
        // if (!this.manager) this.manager
        this.manager = options.manager;

        this.trackRepeat = false;
        this.queueRepeat = false;
        this.position = 0;
        this.playing = false;
        this.paused = false;
        this.volume = 1;

        this.queue = new Queue();

        if (this.manager.players.has(options.guild.id)) {
            return this.manager.players.get(options.guild.id);
        }

        this.voiceChannel = options.voiceChannel;
        this.textChannel = options.textChannel;
        this.guild = options.guild;

        this.manager.newPlayer(this);
    }

    play(track) {
        if (!track) {
            super.play(this.queue.current);
        }
        else {
            super.play(track);
        }
        this.start();
    }

    skip() {
        this.emit('finish');
    }

    pause(pause) {
        if (this.paused === pause || !this.queue.totalSize) return this;
    }

    get(key) {
        return this[key];
    }

    set(key, value) {
        this[key] = value;
    }
};