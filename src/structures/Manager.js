const { Source } = require('yasha');
const { Collection } = require('discord.js');
const EventEmitter = require('events');
const { TrackPlaylist } = require('yasha/src/Track');

const Player = require('./Player');
const QueueHelper = require('../helpers/QueueHelper');
const DatabaseHelper = require('../helpers/DatabaseHelper');
const Logger = require('./Logger');
const FileTrack = require('./FileTrack');

module.exports = class Manager extends EventEmitter {
    constructor() {
        super();
        this.players = new Collection();

        this.logger = new Logger({
            displayTimestamp: true,
            displayDate: true,
        });
    }

    async newPlayer(guild, voiceChannel, textChannel, volume) {
        const player = new Player({
            manager: this,
            guild: guild,
            voiceChannel: voiceChannel,
            textChannel: textChannel,
            external_encrypt: true,
            volume: volume ? volume : await DatabaseHelper.getDefaultVolume(guild),
        });

        this.players.set(player.guild.id, player);

        player.on('ready', () => {
            this.trackStart(player);
        });

        player.on('finish', () => {
            this.trackEnd(player);
        });

        player.on('error', (err) => {
            this.logger.error(err);
        });

        return player;
    }

    trackStart(player) {
        player.playing = true;
        player.paused = false;

        const track = player.queue.current;
        this.emit('trackStart', player, track);
    }

    trackEnd(player) {
        const track = player.queue.current;
        const finished = Math.ceil(player.getTime()) >= (player.getDuration() ? player.getDuration() : track.duration);

        if (track && player.trackRepeat) {
            this.emit('trackEnd', player, track, finished);
            player.play();
            return;
        }

        if (track && player.queueRepeat) {
            player.queue.add(player.queue.current);
            player.queue.current = player.queue.shift();

            this.emit('trackEnd', player, track, finished);
            player.play();
            return;
        }

        if (player.queue.length > 0) {
            player.queue.previous.push(track);
            player.queue.current = player.queue.shift();

            this.emit('trackEnd', player, track, finished);
            player.play();
            return;
        }

        if (!player.queue.length && player.queue.current) {
            this.emit('trackEnd', player, track, finished);
            player.stop();
            player.queue.previous.push(track);
            player.queue.current = null;
            player.playing = false;
            return this.queueEnd(player, track);
        }
    }

    queueEnd(player, track) {
        this.emit('queueEnd', player, track);
        player.destroy();
    }

    get(guild) {
        return this.players.get(guild.id);
    }

    destroy(guild) {
        this.players.delete(guild.id);
    }

    async search(query, requester, source) {
        let track;

        try {
            switch (source) {
                case 'soundcloud':
                    track = (await Source.Soundcloud.search(query))[0];
                    break;
                case 'spotify':
                    track = await Source.resolve(query);
                    break;
                case 'youtube':
                    track = (await Source.Youtube.search(query))[0];
                    break;
                default:
                    track = await Source.resolve(query);
                    break;
            }

            if (!track) track = (await Source.Youtube.search(query))[0];

            if (!track) {
                return (new FileTrack(query, requester));
            }
            else {
                if (track instanceof TrackPlaylist) {
                    track.forEach(t => {
                        t.requester = requester;
                        t.icon = QueueHelper.reduceThumbnails(t.icons);
                        t.thumbnail = QueueHelper.reduceThumbnails(t.thumbnails);
                    });
                }
                else {
                    track.requester = requester;
                    track.icon = QueueHelper.reduceThumbnails(track.icons);
                    track.thumbnail = QueueHelper.reduceThumbnails(track.thumbnails);
                }
                return track;
            }
        }
        catch (err) {
            throw new Error(err);
        }
    }

    getPlayingPlayers() {
        return this.players.filter(p => p.playing);
    }
};