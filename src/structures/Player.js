const { VoiceConnection, TrackPlayer } = require('yasha');

const Queue = require('./Queue');

module.exports = class Player extends TrackPlayer {

    constructor(options) {
        super();

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
    }

    async connect() {
        this.connection = await VoiceConnection.connect(this.voiceChannel);
        this.subscription = this.connection.subscribe(this);
    }

    disconnect() {
        if (this.connection) this.connection.disconnect();
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
        this.manager.trackEnd(this);
    }

    get(key) {
        return this[key];
    }

    set(key, value) {
        this[key] = value;
    }

    setVolume(volume) {
        super.setVolume(volume);
    }

    setBitrate(bitrate) {
        super.setBitrate(bitrate);
    }

    setRate(rate) {
        super.rate(rate);
    }

    setTempo(tempo) {
        super.setTempo(tempo);
    }

    setTremolo(depth, rate) {
        super.setTremolo(depth, rate);
    }

    setEqualizer(equalizer) {
        super.setEqualizer(equalizer);
    }

    getTime() {
        return super.getTime();
    }

    getDuration() {
        return super.getDuration();
    }

    destroy() {
        if (this.connection) this.disconnect();
        super.destroy();

        this.manager.players.delete(this.guild.id);
    }

    setTrackRepeat(repeat) {
        if (repeat) {
            this.trackRepeat = true;
            this.queueRepeat = false;
        }
        else {
            this.trackRepeat = false;
            this.queueRepeat = false;
        }

        return this;
    }

    setQueueRepeat(repeat) {
        if (repeat) {
            this.trackRepeat = false;
            this.queueRepeat = true;
        }
        else {
            this.trackRepeat = false;
            this.queueRepeat = false;
        }

        return this;
    }

    pause(pause) {
        if (this.paused === pause || !this.queue.totalSize) return this;

        this.playing = !pause;
        this.paused = pause;

        this.setPaused(pause);

        return this;
    }

    seek(time) {
        if (!this.queue.current) return undefined;
        time = Number(time);

        if (time < 0 || time > this.queue.current.duration)
            time = Math.max(Math.min(time, this.queue.current.duration), 0);

        super.seek(time);
    }
};