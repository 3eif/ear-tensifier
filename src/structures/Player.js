const { TrackPlayer } = require('yasha');

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

        this.manager.newPlayer(this);
        this.manager.emit('playerCreate', this);

        // this.setVolume(options.volume ? options.volume : 100);
    }

    play(track) {
        if (!track) {
            super.play(this.queue.current);
            console.log(this.queue.current);
        }
        else {
            super.play(track);
        }
        console.log('hi');
        this.start();
    }

    skip() {
        this.emit('finish');
    }

    pause(pause) {
        this.paused = pause;
        super.setPaused(pause);
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

    seek(time) {
        super.seek(time);
    }

    getTime() {
        return super.getTime();
    }

    getDuration() {
        return super.getDuration();
    }

    destroy() {
        super.destroy();

        this.manager.emit('playerDestroy', this);
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
};