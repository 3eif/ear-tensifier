class Filter {
    constructor(player) {
        this.player = player;
    }

    off() {
        this.player.setEqualizer([]);
        // this.player.setTremolo(0, 0);
        // this.player.setTempo(1);
        // this.player.setRate(1);
        // this.player.setBitrate(1);
        // this.player.setVolume(1);
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
        this.player.setEqualizer([]);
    }
}

class Nightcore extends Filter {
    constructor(player) {
        super(player);
    }

    on() {
        this.player.setRate(1.2);
        this.player.setTremolo(0.3, 14);
    }

    off() {
        this.player.setTremolo(0, 0);
        this.player.setRate(1);
    }
}

class Vaporwave extends Filter {
    constructor(player) {
        super(player);
    }

    on() {
        this.player.setRate(0.7);
        this.player.setTremolo(0.3, 14);
    }

    off() {
        this.player.setTremolo(0, 0);
        this.player.setRate(1);
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
        this.player.setEqualizer([]);
    }
}


module.exports = { Filter, Bass, Nightcore, Vaporwave, Bassboost };