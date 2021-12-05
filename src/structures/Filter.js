module.exports = class Filter {
    constructor(player) {
        this.player = player;

        this.defaultEqualizer = [];
        this.defaultTremolo = {
            depth: 0,
            frequency: 5,
        };
        this.defaultTempo = 1;
        this.defaultRate = 1;
        this.defaultVolume = 100;

        this.equalizer = [];
        this.tremolo = this.defaultTremolo;
        this.tempo = this.defaultTempo;
        this.rate = this.defaultRate;
        this.volume = this.defaultVolume;
    }

    resetAll() {
        this.resetEqualizer();
        this.resetTremolo();
        this.resetTempo();
        this.resetRate();
        this.resetVolume();
    }

    setEqualizer(equalizer) {
        this.equalizer = equalizer;
        this.player.setEqualizer(this.equalizer);
    }

    setTremolo(depth, frequency) {
        this.tremolo = {
            depth: depth ? this.clamp(depth, 0.01, 0.99) : 0,
            frequency: frequency ? this.clamp(frequency, 0.1, 20000) : 5,
        };
        this.player.setTremolo(this.tremolo.depth, this.tremolo.frequency);
    }

    setTempo(tempo) {
        this.tempo = tempo ? this.clamp(tempo, 0.5, 10) : 1;
        this.player.setTempo(this.tempo);
    }

    setRate(rate) {
        this.rate = rate ? this.clamp(rate, 0.01, 10) : 1;
        this.player.setRate(this.rate);
    }

    setVolume(volume) {
        this.volume = volume;
        this.player.setVolume(this.volume);
    }

    resetEqualizer() {
        this.setEqualizer(this.defaultEqualizer);
    }

    resetTremolo() {
        this.setTremolo(this.defaultTremolo.depth, this.defaultTremolo.frequency);
    }

    resetDepth() {
        this.setTremolo(this.defaultTremolo.depth, this.tremolo.frequency);
    }

    resetFrequency() {
        this.setTremolo(this.tremolo.depth, this.defaultTremolo.frequency);
    }

    resetTempo() {
        this.setTempo(this.defaultTempo);
    }

    resetRate() {
        this.setRate(this.defaultRate);
    }

    resetVolume() {
        this.setVolume(this.defaultVolume);
    }

    setBass(bool) {
        if (bool) {
            this.setEqualizer([
                {
                    band: 32,
                    gain: 6,
                },
                {
                    band: 64,
                    gain: 5,
                },
                {
                    band: 125,
                    gain: 4,
                },
                {
                    band: 250,
                    gain: 3,
                },
                {
                    band: 500,
                    gain: 1,
                },
            ]);
        }
        else this.setEqualizer(this.defaultEqualizer);
    }

    setNightcore(bool) {
        if (bool) {
            this.setRate(1.2);
            this.setTremolo(0.2, 15);
        }
        else {
            this.setTremolo(this.defaultTremolo.depth, this.defaultTremolo.frequency);
            this.setRate(this.defaultRate);
        }
    }

    setVaporwave(bool) {
        if (bool) {
            this.setRate(0.8);
            this.setTremolo(0.2, 15);
        }
        else {
            this.setTremolo(this.defaultTremolo.depth, this.defaultTremolo.frequency);
            this.setRate(this.defaultRate);
        }
    }

    setBassboost(bool, bb) {
        if (bool) {
            bb = bb ? this.clamp(bb, -30, 10) : 5;
            return this.player.setEqualizer([
                {
                    band: 32,
                    gain: 12 * (bb / 5),
                },
                {
                    band: 64,
                    gain: 9 * (bb / 5),
                },
                {
                    band: 125,
                    gain: 7 * (bb / 5),
                },
                {
                    band: 250,
                    gain: 5 * (bb / 5),
                },
                {
                    band: 500,
                    gain: 3 * (bb / 5),
                },
            ]);
        }
        else this.player.setEqualizer(this.defaultEqualizer);
    }

    setEarrape(bool) {
        if (bool) {
            const bb = 5;
            const volume = 500;

            this.setVolume(volume);
            return this.player.setEqualizer([
                {
                    band: 32,
                    gain: 12 * (bb / 5),
                },
                {
                    band: 64,
                    gain: 9 * (bb / 5),
                },
                {
                    band: 125,
                    gain: 7 * (bb / 5),
                },
                {
                    band: 250,
                    gain: 5 * (bb / 5),
                },
                {
                    band: 500,
                    gain: 3 * (bb / 5),
                },
            ]);
        }
        else {
            this.setEqualizer(this.defaultEqualizer);
            this.volume = this.defaultVolume;
        }
    }

    setAllFilters() {
        this.setEqualizer(this.equalizer);
        this.setTremolo(this.tremolo.depth, this.tremolo.frequency);
        this.setTempo(this.tempo);
        this.setRate(this.rate);
        this.setVolume(this.volume);
    }

    clamp(number, min, max) {
        return Math.max(min, Math.min(number, max));
    }
};