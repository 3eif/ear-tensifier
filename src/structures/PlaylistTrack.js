const { Track, Source } = require('yasha');

module.exports = class PlaylistTrack {
    constructor(track) {
        this.id = track.id;
        this.title = track.title;
        this.duration = track.duration;
        this.thumbnail = track.thumbnail;
        this.owner_name = track.owner_name;
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
            case 'Spotify':
                return Source.Spotify.getStreams(this.id);
            default:
                return null;
        }
    }
};