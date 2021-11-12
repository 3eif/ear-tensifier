/* eslint-disable no-unused-vars */
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

const Bot = require('../models/Bot');
const Playlist = require('../models/Playlist');
const Server = require('../models/Server');
const Song = require('../models/Song');
const User = require('../models/User');
const Track = require('../models/Track');

async function migrateBotsCollection() {
    OldBot.find(async (err, bots) => {
        if (err) {
            console.log(err);
        }
        else {
            Bot.findById('472714545723342848', async (err, bot) => {
                if (!bot) {
                    return console.log('Bot does not exist.');
                    // console.log('Creating new bot');
                    // const newBot = new Bot({
                    //     _id: bot.clientID,
                    //     username: bot.clientName,
                    //     commandsUsed: bot.commandsUsed,
                    //     songsPlayed: bot.songsPlayed,
                    //     lastPosted: bot.lastPosted,
                    // });
                    // await newBot.save().catch(e => console.log(e));
                }

                const commands = [];
                OldCommand.find(async (err, oldCommands) => {
                    if (err) {
                        console.log(err);
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

                        console.log('Updating existing bot');
                        await bot.updateOne({
                            username: bot.clientName,
                            commands: commands,
                            commandsUsed: bot.commandsUsed,
                            songsPlayed: bot.songsPlayed,
                            lastPosted: bot.lastPosted,
                        }).catch(e => console.log(e));
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
                console.log(`${oldPlaylist._id} Creating new playlist`);
                const newPlaylist = new Playlist({
                    name: oldPlaylist.name,
                    songs: songs,
                    thumbnail: oldPlaylist.thumbnail,
                    creator: oldPlaylist.creator,
                    createdTimestamp: oldPlaylist.timeCreated,
                });
                await newPlaylist.save().catch(e => console.log(e));
            }
            else {
                console.log(`${oldPlaylist._id} Updating existing playlist`);
                await playlist.updateOne({
                    name: oldPlaylist.name,
                    songs: songs,
                    thumbnail: oldPlaylist.thumbnail,
                    creator: oldPlaylist.creator,
                    createdTimestamp: oldPlaylist.timeCreated,
                }).catch(e => console.log(e));
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
                console.log(`${oldUser._id} Creating new user`);
                const newUser = new User({
                    _id: oldUser.authorID,
                    bio: oldUser.bio,
                    songsPlayed: oldUser.songsPlayed,
                    commandsUsed: oldUser.commandsUsed,
                    blacklisted: oldUser.blocked,
                    developer: oldUser.developer,
                });
                await newUser.save().catch(e => console.log(e));
            }
            else {
                console.log(`${oldUser._id} Updating existing user`);
                await user.updateOne({
                    bio: oldUser.bio,
                    songsPlayed: oldUser.songsPlayed,
                    commandsUsed: oldUser.commandsUsed,
                    blacklisted: oldUser.blocked,
                    developer: oldUser.developer,
                }).catch(e => console.log(e));
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
                console.log(`${oldServer.serverID} Creating new server`);
                const newServer = new Server({
                    _id: oldServer.serverID,
                    prefix: oldServer.bio,
                    ignoredChannels: oldServer.songsPlayed,
                    nowPlayingMessages: true,
                    defaultVolume: 100,
                });
                await newServer.save().catch(e => console.log(e));
            }
            else {
                console.log(`${oldServer.serverID} Updating existing server`);
                await server.updateOne({
                    prefix: oldServer.prefix,
                    ignoredChannels: oldServer.ignoredChannels,
                    nowPlayingMessages: true,
                    defaultVolume: 100,
                }).catch(e => console.log(e));
            }
            addedServers.push(oldServer.serverID);
        });
    }

}

migrateBotsCollection();
migratePlaylistsCollection();
migrateUsersCollection();
migrateServersCollection();
