class Filter {
    constructor(player) {
        this.player = player;

        this.defaultEqualizer = [];
        this.defaultTremolo = {
            depth: 0.5,
            frequency: 5.0,
        };
        this.defaultTempo = 1;
        this.defaultRate = 1;
        this.defaultVolume = 100;
    }

    off() {
        this.player.setEqualizer(this.defaultEqualizer);
        this.player.setTremolo(this.defaultTremolo.depth, this.defaultTremolo.frequency);
        this.player.setTempo(this.defaultTempo);
        this.player.setRate(this.defaultRate);
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
        this.player.setTremolo(0.4, 15);
    }

    off() {
        this.player.setTremolo(this.defaultTremolo.depth, this.defaultTremolo.frequency);
        this.player.setRate(this.defaultRate);
    }
}

class Vaporwave extends Filter {
    constructor(player) {
        super(player);
    }

    on() {
        this.player.setRate(0.8);
        this.player.setTremolo(0.4, 15);
    }

    off() {
        this.player.setTremolo(this.defaultTremolo.depth, this.defaultTremolo.frequency);
        this.player.setRate(this.defaultRate);
    }
}

class Bassboost extends Filter {
    constructor(player, bb) {
        super(player);
        this.bb = bb ? super.clamp(bb, -30, 10) : 5;
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
        this.rate = super.clamp(rate, 0.01, 10);
    }

    on() {
        this.player.setRate(this.rate);
    }

    off() {
        this.player.setRate(this.defaultRate);
    }
}

class Tempo extends Filter {
    constructor(player, tempo) {
        super(player);
        this.tempo = tempo ? super.clamp(tempo, 0.5, 10) : 1;
    }

    on() {
        this.player.setTempo(this.tempo);
    }

    off() {
        this.player.setTempo(this.defaultTempo);
    }
}

class Tremolo extends Filter {
    constructor(player, depth, frequency) {
        super(player);
        this.depth = depth ? super.clamp(depth, 0.01, 0.99) : 0.5;
        this.frequency = frequency ? super.clamp(frequency, 0.1, 20000) : 5;
    }

    on() {
        this.player.setTremolo(this.depth, this.frequency);
    }

    setDepth(depth) {
        this.depth = depth ? super.clamp(depth, 0.01, 0.99) : 0.5;
        this.on();
    }

    setFrequency(frequency) {
        this.frequency = frequency ? super.clamp(frequency, 0.1, 20000) : 5;
        this.on();
    }

    off() {
        this.player.setTempo(this.defaultTremolo.depth, this.defaultTremolo.frequency);
    }
}


module.exports = { Filter, Bass, Nightcore, Vaporwave, Bassboost, Earrape, Rate, Tempo, Tremolo };