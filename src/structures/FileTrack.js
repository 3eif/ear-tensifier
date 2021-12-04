const { Track: { TrackStreams, TrackStream } } = require('yasha');
const VideoLength = require('video-length');

module.exports = class FileTrack {
    constructor(url, requester) {
        this.url = url;
        this.requester = requester;
        this.author = 'Unknown Author';
        this.title = 'Unknown Title';
        this.platform = 'File';
    }

    async getStreams() {
        const url = this.url;
        const streams = new class extends TrackStreams {
            constructor() {
                super();
                this.push(new TrackStream(url).setTracks(false, true));
            }
        };
        return streams;
    }

    static async getDuration(url) {
        try {
            return await VideoLength(url);
        }
        catch (err) {
            return undefined;
        }
    }
};

