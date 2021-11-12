const { Source } = require('yasha');

module.exports = class PlaylistTrack extends Source.Youtube.Track {
    constructor(track) {
        super();

        this.id = track.id;
        this.title = track.title;
        this.url = track.url;
        this.duration = track.duration;
        this.thumbnail = track.thumbnail;
        this.owner_name = track.author;
        this.platform = track.platform;
    }
};