const { Source } = require('yasha');

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
        switch (this.platform.toLowerCase()) {
            case 'youtube':
                return Source.Youtube.getStreams(this.id);
            case 'soundcloud':
                return Source.Soundcloud.getStreams(this.id);
            case 'spotify':
                return Source.Spotify.getStreams(this.id);
            default:
                return Source.Youtube.getStreams(this.id);
        }
    }
};