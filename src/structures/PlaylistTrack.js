const { Source, Track: { TrackStreams, TrackStream } } = require('yasha');

module.exports = class PlaylistTrack {
    constructor(track) {
        this.id = track.id;
        this.title = track.title;
        this.duration = track.duration;
        this.thumbnail = track.thumbnail;
        this.author = track.author;
        this.platform = track.platform;
        this.requester = track.requester;
        this.url = track.url;

        this.streams = null;
    }

    async getStreams() {
        switch (this.platform) {
            case 'youtube':
                return Source.Youtube.getStreams(this.id);
            case 'soundcloud':
                return Source.Soundcloud.getStreams(this.id);
            case 'spotify':
                return Source.Spotify.getStreams(this.id);
            case 'file': {
                const url = this.url;
                const streams = new class extends TrackStreams {
                    constructor() {
                        super();
                        this.push(new TrackStream(url).setTracks(false, true));
                    }
                };
                return streams;
            }
            default:
                return null;
        }
    }
};