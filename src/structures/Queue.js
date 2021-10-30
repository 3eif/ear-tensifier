const { Track } = require('node-ffplayer');

class Queue extends Array {
    add(track, index) {
        this.splice(index, 0, track);
    }

    remove(index) {
        this.splice(index, 1);
    }

    clear() {
        this.splice(0);
    }

    shuffle() {
        for (let i = this.length - 1; i > 0; i--) {
            const n = Math.floor(Math.random() * (i + 1));
            [this[i], this[n]] = [this[n], this[i]];
        }
    }
}