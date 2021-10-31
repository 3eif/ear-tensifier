const { TrackPlayer } = require('node-ffplayer');

const Queue = require('./Queue');

module.exports = class Player extends TrackPlayer {

    constructor(options) {
        super();
        // if (!this.manager) this.manager
        this.manager = options.client.music;

        this.trackRepeat = false;
        this.queueRepeat = false;
        this.position = 0;
        this.playing = false;
        this.paused = false;
        this.volume = 1;

        this.queue = new Queue();

        if (this.manager.players.has(options.guildId)) {
            return this.manager.players.get(options.guildId);
        }

        this.voiceChannelId = options.voiceChannelId;
        this.textChannelId = options.textChannelId;
        this.guildId = options.guildId;

        this.manager.players.set(options.guildId, this);

        this.emit = this.manager.emit.bind(this.manager, this);
    }

    play(track) {
        super.play(track);
        this.start();
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