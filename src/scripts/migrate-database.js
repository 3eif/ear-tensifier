const mongoose = require('mongoose');
require('custom-env').env(true);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const botSchema = mongoose.Schema({
    clientID: Number,
    clientName: String,
    commandsUsed: Number,
    songsPlayed: Number,
    lastPosted: Number,
});

const commandSchema = mongoose.Schema({
    commandName: String,
    timesUsed: Number,
});

const playlistSchema = mongoose.Schema({
    name: String,
    songs: Array,
    timeCreated: Number,
    thumbnail: String,
    creator: String,
});

const serverSchema = mongoose.Schema({
    serverID: String,
    prefix: String,
    ignore: Array,
    roleSystem: Boolean,
});

const songSchema = mongoose.Schema({
    songID: String,
    type: String,
    songName: String,
    songAuthor: String,
    songDuration: Number,
    timesPlayed: Number,
    timesAdded: Number,
    songThumbnail: String,
});

const userSchema = mongoose.Schema({
    authorID: String,
    bio: String,
    songsPlayed: Number,
    commandsUsed: Number,
    blocked: Boolean,
    premium: Boolean,
    pro: Boolean,
    developer: Boolean,
    moderator: Boolean,
    voted: Boolean,
    votedTimes: Number,
    votedConst: Boolean,
    lastVoted: String,
});

const OldBot = mongoose.model('bot', botSchema);
const OldCommand = mongoose.model('command', commandSchema);
const OldPlaylist = mongoose.model('playlist', playlistSchema);
const OldServer = mongoose.model('server', serverSchema);
const OldSong = mongoose.model('song', songSchema);
const OldUser = mongoose.model('user', userSchema);

const Bot = require('../models/bot');
const Command = require('../models/command');
const Playlist = require('../models/playlist');
const Server = require('../models/server');
const Song = require('../models/song');
const User = require('../models/user');

async function migrateBotsCollection() {
    OldBot.find(async (err, bots) => {
        if (err) {
            console.log(err);
        }
        else {
            for (let i = 0; i < bots.length; i++) {
                Bot.findById(bots[i].clientID, async (err, bot) => {
                    if (!bot) {
                        console.log('Creating new bot');
                        const newBot = new Bot({
                            _id: bots[i].clientID,
                            username: bots[i].clientName,
                            commandsUsed: bots[i].commandsUsed,
                            songsPlayed: bots[i].songsPlayed,
                            lastPosted: bots[i].lastPosted,
                        });
                        await newBot.save().catch(e => console.log(e));
                    }
                    else {
                        console.log('Updating bot');
                        bot.username = bots[i].clientName;
                        bot.commandsUsed = bots[i].commandsUsed;
                        bot.songsPlayed = bots[i].songsPlayed;
                        bot.lastPosted = bots[i].lastPosted;
                        await bot.save().catch(e => console.log(e));
                    }
                });
            }
        }
    });
}

async function migratePlaylistsCollection() {
    OldPlaylist.find(async (err, playlists) => {
        if (err) {
            console.log(err);
        }
        else {
            for (let i = 0; i < playlists.length; i++) {
                Playlist.findById(playlists[i]._id, async (err, playlist) => {
                    const songs = await migrateSongs(playlists[i].songs);
                    if (!playlist) {
                        console.log(`${i} Creating new playlist`);
                        const newPlaylist = new Playlist({
                            name: playlists[i].name,
                            songs: songs,
                            thumbnail: playlists[i].thumbnail,
                            creator: playlists[i].creator,
                            createdTimestamp: playlists[i].timeCreated,
                        });
                        await newPlaylist.save().catch(e => console.log(e));
                    }
                    else {
                        console.log(`${i} Updating playlist`);
                        playlist.name = playlists[i].name;
                        playlist.songs = songs;
                        playlist.thumbnail = playlists[i].thumbnail;
                        playlist.creator = playlists[i].creator;
                        playlist.createdTimestamp = playlists[i].timeCreated;
                        await playlist.save().catch(e => console.log(e));
                    }
                });
            }
        }
    });
}

async function migrateSongs(songs) {
    const newSongs = [];
    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const newSong = {
            id: song.identifier,
            title: song.title,
            url: song.uri,
            author: song.author,
            duration: song.duration,
            thumbnail: song.thumbnail,
        };
        newSongs.push(newSong);
    }
    return newSongs;
}

// migrateBotsCollection();
migratePlaylistsCollection();