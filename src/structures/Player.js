const { VoiceConnection, TrackPlayer } = require('yasha');
const { EmbedBuilder } = require('discord.js');

const Queue = require('./Queue');
const Filter = require('./Filter');

module.exports = class Player extends TrackPlayer {

    constructor(options) {
        super({ external_encrypt: true, external_packet_send: true });

        this.manager = options.manager;

        this.trackRepeat = false;
        this.queueRepeat = false;

        this.stayInVoice = false;

        this.position = 0;
        this.playing = false;
        this.paused = false;
        this.volume = options.volume ? options.volume : 100;

        this.queue = new Queue();

        if (this.manager.players.has(options.guild.id)) {
            return this.manager.players.get(options.guild.id);
        }

        this.voiceChannel = options.voiceChannel;
        this.textChannel = options.textChannel;
        this.guild = options.guild;

        this.filter = new Filter(this);

        this.leaveTimeout = null;
    }

    async connect() {
        this.connection = await VoiceConnection.connect(
            this.voiceChannel,
            {
                selfDeaf: true,
            },
        );
        this.subscription = this.connection.subscribe(this);
        this.connection.on('error', (error) => {
            this.manager.logger.error(error);
        });
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
        clearTimeout(this.leaveTimeout);
        this.leaveTimeout = null;
        this.start();
        this.filter.setAllFilters();
    }

    skip() {
        this.manager.trackEnd(this, false);
    }

    get(key) {
        return this[key];
    }

    set(key, value) {
        this[key] = value;
    }

    setVolume(volume) {
        if (volume > 100000) volume = 100000;
        super.setVolume(volume / 100);
    }

    setBitrate(bitrate) {
        super.setBitrate(bitrate);
    }

    setRate(rate) {
        super.setRate(rate);
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
        if (!this.player) return 0;
        return super.getTime();
    }

    getDuration() {
        return super.getDuration();
    }

    async softDestroy(force) {
        try {
            if (this.stayInVoice && !force) return;

            if (this.nowPlayingMessage) {
                // if (this.nowPlayingMessageInterval) clearInterval(this.nowPlayingMessageInterval);
                // eslint-disable-next-line no-empty-function
                await this.nowPlayingMessage.edit({ components: [] }).catch(() => { });
            }
            if (this.connection) this.disconnect();
            if (this.player) super.destroy();

            this.manager.players.delete(this.guild.id);
        }
        catch (e) {
            this.manager.logger.error(e);
        }
    }

    async destroy(force) {
        super.destroy();

        await this.softDestroy(force).catch((e) => this.manager.logger.error(e));
    }

    setTrackRepeat(repeat) {
        if (repeat) {
            this.trackRepeat = true;
            this.queueRepeat = false;
        }
        else {
            this.trackRepeat = false;
        }

        return this;
    }

    setQueueRepeat(repeat) {
        if (repeat) {
            this.trackRepeat = false;
            this.queueRepeat = true;
        }
        else {
            this.queueRepeat = false;
        }

        return this;
    }

    pause(pause) {
        if (this.queue.current && this.nowPlayingMessage) {
            const newNowPlayingEmbed = EmbedBuilder.from(this.nowPlayingMessage.embeds[0])
                .setAuthor({ name: this.queue.current.author, iconURL: this.pause ? 'https://eartensifier.net/images/cd.png' : 'https://eartensifier.net/images/cd.gif', url: this.queue.current.url });

            this.nowPlayingMessage.edit({ content: null, embeds: [newNowPlayingEmbed] });
        }

        if (this.paused === pause || !this.queue.totalSize) return this;

        this.playing = !pause;
        this.paused = pause;

        if (this.player) this.setPaused(pause);

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