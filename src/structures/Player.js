const { TrackPlayer } = require('node-ffplayer');

module.exports = class Player extends TrackPlayer {
    constructor(options) {
        super();
        // if (!this.manager) this.manager
        this.manager = options.client.manager;

        if (this.manager.players.has(options.guildId)) {
            return this.manager.players.get(options.guildId);
        }

        this.voiceChannelId = options.voiceChannelId;
        this.textChannelId = options.textChannelId;
        this.guildId = options.guildId;

        this.manager.players.set(options.guildId, this);
        // this.manager.emit('playerCreated', this);
    }

    get(key) {
        return this[key];
    }

    set(key, value) {
        this[key] = value;
    }

    init(manager) {
        this.manager = manager;
    }
};