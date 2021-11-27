class Filter {
    constructor(player) {
        this.player = player;

        this.defaultEqualizer = [];
        this.defaultTremolo = {
            gain: 0,
            frequency: 0,
        };
        this.defaultTempo = 1;
        this.defaultRate = 1;
        this.defaultBitrate = 1;
        this.defaultVolume = 100;
    }

    off() {
        this.player.setEqualizer(this.defaultEqualizer);
        this.player.setTremolo(this.defaultTremolo.gain, this.defaultTremolo.frequency);
        this.player.setTempo(this.defaultTempo);
        this.player.setRate(this.defaultRate);
        this.player.setBitrate(this.defaultBitrate);
        this.player.setVolume(this.defaultVolume);
    }

    clamp(number, min, max) {
        return Math.max(min, Math.min(number, max));
    }
}

class Bass extends Filter {
    constructor(player) {
        super(player);
    }

    on() {
        this.player.setEqualizer([
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

    off() {
        this.player.setEqualizer(this.defaultEqualizer);
    }
}

class Nightcore extends Filter {
    constructor(player) {
        super(player);
    }

    on() {
        this.player.setRate(1.2);
        this.player.setTremolo(0.5, 15);
    }

    off() {
        this.player.setTremolo(this.defaultTremolo.gain, this.defaultTremolo.frequency);
        this.player.setRate(this.defaultRate);
    }
}

class Vaporwave extends Filter {
    constructor(player) {
        super(player);
    }

    on() {
        this.player.setRate(0.8);
        this.player.setTremolo(0.5, 15);
    }

    off() {
        this.player.setTremolo(this.defaultTremolo.gain, this.defaultTremolo.frequency);
        this.player.setRate(this.defaultRate);
    }
}

class Bassboost extends Filter {
    constructor(player, bb) {
        super(player);
        this.bb = bb ? super.clamp(bb, -30, 30) : 5;
    }

    on() {
        return this.player.setEqualizer([
            {
                band: 32,
                gain: 12 * (this.bb / 5),
            },
            {
                band: 64,
                gain: 9 * (this.bb / 5),
            },
            {
                band: 125,
                gain: 7 * (this.bb / 5),
            },
            {
                band: 250,
                gain: 5 * (this.bb / 5),
            },
            {
                band: 500,
                gain: 3 * (this.bb / 5),
            },
        ]);
    }

    off() {
        this.player.setEqualizer(this.defaultEqualizer);
    }
}

class Earrape extends Filter {
    constructor(player) {
        super(player);
        this.bb = 5;
        this.volume = 500;
    }

    on() {
        this.player.setVolume(this.volume);
        return this.player.setEqualizer([
            {
                band: 32,
                gain: 12 * (this.bb / 5),
            },
            {
                band: 64,
                gain: 9 * (this.bb / 5),
            },
            {
                band: 125,
                gain: 7 * (this.bb / 5),
            },
            {
                band: 250,
                gain: 5 * (this.bb / 5),
            },
            {
                band: 500,
                gain: 3 * (this.bb / 5),
            },
        ]);
    }

    off() {
        this.player.setEqualizer(this.defaultEqualizer);
        this.volume = this.defaultVolume;
    }
}

class Rate extends Filter {
    constructor(player, rate) {
        super(player);
        this.rate = rate ? super.clamp(rate, 0.01, 10) : 1;
    }

    on() {
        this.player.setRate(this.rate);
    }

    off() {
        this.player.setRate(this.defaultRate);
    }
}

module.exports = { Filter, Bass, Nightcore, Vaporwave, Bassboost, Earrape, Rate };