const { Track: { TrackStreams, TrackStream } } = require('yasha');

module.exports = class FileTrack {
    constructor(url) {
        this.url = url;
    }

    async getStreams() {
        return new class extends TrackStreams {
            constructor() {
                super();
                this.push(new TrackStream(this.url));
            }
        };
    }
};

