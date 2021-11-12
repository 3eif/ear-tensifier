/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const signale = require('signale');
require('custom-env').env(true);

signale.config({
    displayFilename: true,
    displayTimestamp: true,
    displayDate: false,
});

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

const Bot = require('../models/Bot');
const Playlist = require('../models/Playlist');
const Server = require('../models/Server');
const Song = require('../models/Song');
const User = require('../models/User');
const Track = require('../models/Track');

async function migrateBotsCollection() {
    OldBot.find(async (err, bots) => {
        if (err) {
            signale.error(err);
        }
        else {
            Bot.findById('472714545723342848', async (err, bot) => {
                if (!bot) return signale.error('Bot does not exist.');

                const commands = [];
                OldCommand.find(async (err, oldCommands) => {
                    if (err) {
                        signale.error(err);
                    }
                    else {
                        for (let i = 0; i < oldCommands.length; i++) {
                            const command = oldCommands[i];
                            const newCommand = {
                                _id: command.commandName,
                                timesUsed: command.timesUsed,
                            };
                            commands.push(newCommand);
                        }

                        signale.pending('Updating existing bot');
                        await bot.updateOne({
                            username: bot.clientName,
                            commands: commands,
                            commandsUsed: bot.commandsUsed,
                            songsPlayed: bot.songsPlayed,
                            lastPosted: bot.lastPosted,
                        }).catch(e => signale.error(e));
                    }
                });
            });
        }
    });
}

async function migratePlaylistsCollection() {
    const cursor = OldPlaylist.find().cursor();
    for (let oldPlaylist = await cursor.next(); oldPlaylist != null; oldPlaylist = await cursor.next()) {
        Playlist.findById(oldPlaylist._id, async (err, playlist) => {
            const songs = await migrateTracks(oldPlaylist.songs);
            if (!playlist) {
                signale.pending('%s Creating new playlist', oldPlaylist._id);
                const newPlaylist = new Playlist({
                    name: oldPlaylist.name,
                    songs: songs,
                    thumbnail: oldPlaylist.thumbnail,
                    creator: oldPlaylist.creator,
                    createdTimestamp: oldPlaylist.timeCreated,
                });
                await newPlaylist.save().catch(e => signale.error(e));
            }
            else {
                signale.pending('%s Updating existing playlist', oldPlaylist._id);
                await playlist.updateOne({
                    name: oldPlaylist.name,
                    songs: songs,
                    thumbnail: oldPlaylist.thumbnail,
                    creator: oldPlaylist.creator,
                    createdTimestamp: oldPlaylist.timeCreated,
                }).catch(e => signale.error(e));
            }
        });

    }
}

async function migrateTracks(tracks) {
    const newTracks = [];
    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const newTrack = {
            _id: track.identifier,
            title: track.title,
            url: track.uri,
            author: track.author,
            duration: track.duration,
            thumbnail: track.thumbnail,
            platform: track.type,
        };
        newTracks.push(newTrack);
    }
    return newTracks;
}

async function migrateUsersCollection() {
    const cursor = OldUser.find().cursor();
    const addedUsers = [];
    for (let oldUser = await cursor.next(); oldUser != null; oldUser = await cursor.next()) {
        User.findById(oldUser.authorID, async (err, user) => {
            if (!user && !addedUsers.includes(oldUser.authorID)) {
                signale.pending('%s Creating new user', oldUser.authorID);
                const newUser = new User({
                    _id: oldUser.authorID,
                    bio: oldUser.bio,
                    songsPlayed: oldUser.songsPlayed,
                    commandsUsed: oldUser.commandsUsed,
                    blacklisted: oldUser.blocked,
                    developer: oldUser.developer,
                });
                await newUser.save().catch(e => signale.error(e));
            }
            else {
                signale.pending('%s Updating existing user', oldUser.authorID);
                await user.updateOne({
                    bio: oldUser.bio,
                    songsPlayed: oldUser.songsPlayed,
                    commandsUsed: oldUser.commandsUsed,
                    blacklisted: oldUser.blocked,
                    developer: oldUser.developer,
                }).catch(e => signale.error(e));
            }
            addedUsers.push(oldUser.authorID);
        });
    }
}

async function migrateServersCollection() {
    const cursor = OldServer.find().cursor();
    const addedServers = [];
    for (let oldServer = await cursor.next(); oldServer != null; oldServer = await cursor.next()) {
        Server.findById(oldServer.serverID, async (err, server) => {
            if (!server && !addedServers.includes(oldServer.serverID)) {
                signale.pending('%s Creating new server', oldServer.serverID);
                const newServer = new Server({
                    _id: oldServer.serverID,
                    prefix: oldServer.bio,
                    ignoredChannels: oldServer.songsPlayed,
                });
                await newServer.save().catch(e => signale.error(e));
            }
            else {
                signale.pending('%s Updating existing server', oldServer.serverID);
                await server.updateOne({
                    prefix: oldServer.prefix,
                    ignoredChannels: oldServer.ignoredChannels,
                }).catch(e => signale.error(e));
            }
            addedServers.push(oldServer.serverID);
        });
    }

}

migrateBotsCollection();
migratePlaylistsCollection();
migrateUsersCollection();
migrateServersCollection();
