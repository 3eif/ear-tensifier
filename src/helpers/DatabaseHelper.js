const Bot = require('../models/Bot');
// const Song = require('../models/Song');
const User = require('../models/User');
const Server = require('../models/Server');

module.exports = class DatabaseHelper {
    constructor(client) {
        this.client = client;
        this.logger = this.client.logger;
    }

    updateAll() {
        if (Date.now() > this.client.lastUpdatedDatabase + 1200000) {
            const updateBot = new Promise((resolve) => {
                Bot.findById(this.client.user.id).then(async bot => {
                    if (!bot) {
                        const newBot = new Bot({
                            _id: this.client.user.id,
                            username: this.client.name,
                            commands: [],
                            commandsUsed: this.client.totalCommandsUsed,
                            songsPlayed: this.client.totalSongsPlayed,
                            websiteData: {
                                guilds: 0,
                                users: 0,
                                players: 0,
                            },
                        });
                        await newBot.save().catch(e => this.logger.error(e));
                    }
                    else {
                        bot.updateOne({ commandsUsed: bot.commandsUsed + this.client.totalCommandsUsed }).catch(e => this.logger.error(e));
                        bot.updateOne({ songsPlayed: bot.songsPlayed + this.client.totalSongsPlayed }).catch(e => this.logger.error(e));
                    }

                    for (let i = 0; i < this.client.timesCommandsUsed.length; i++) {
                        const cmd = this.client.timesCommandsUsed[i];
                        const commandIndex = bot.commands.findIndex(c => c._id === cmd.name);
                        if (commandIndex === -1) {
                            bot.updateOne({ commands: [...bot.commands, { _id: cmd.name, timesUsed: 1 }] }).catch(e => this.logger.error(e));
                        }
                        else {
                            bot.updateOne({ commands: [...bot.commands.slice(0, commandIndex), { _id: cmd.name, timesUsed: bot.commands[commandIndex].timesUsed + cmd.timesUsed }, ...bot.commands.slice(commandIndex + 1)] }).catch(e => this.logger.error(e));
                        }
                    }
                    resolve();
                });
            });

            // const updateSongs = new Promise((resolve) => {
            //     for (let i = 0; i < this.client.timesSongsPlayed.length; i++) {
            //         const song = this.client.timesSongsPlayed[i];
            //         if (song.url) {
            //             Song.findById(song.url).then(async s => {
            //                 if (!s) {
            //                     const newSong = new Song({ _id: song.url, title: song.title, id: song.id, author: song.author, duration: song.duration, thumbnail: song.thumbnail, platform: song.platform, timesPlayed: song.timesPlayed });
            //                     await newSong.save().catch(e => this.logger.error(e));
            //                 }
            //                 else {
            //                     s.updateOne({ timesPlayed: s.timesPlayed + song.timesPlayed }).catch(e => this.logger.error(e));
            //                 }
            //                 if (i == this.client.timesSongsPlayed.length - 1) resolve();
            //             });
            //         }
            //     }
            //     resolve();
            // });

            const updateUsers = new Promise((resolve) => {
                for (let i = 0; i < this.client.usersStats.length; i++) {
                    const user = this.client.usersStats[i];
                    User.findById(user.id).then(async u => {
                        if (!u) {
                            const newUser = new User({ _id: user.id, username: user.username, songsPlayed: user.songsPlayed, commandsUsed: user.commandsUsed });
                            await newUser.save().catch(e => this.logger.error(e));
                        }
                        else {
                            u.updateOne({ songsPlayed: u.songsPlayed + user.songsPlayed, commandsUsed: u.commandsUsed + user.commandsUsed }).catch(e => this.logger.error(e));
                        }
                        if (i == this.client.usersStats.length - 1) resolve();
                    });
                }
                resolve();
            });

            Promise.all([updateBot, updateUsers]).then(() => {
                this.client.totalCommandsUsed = 0;
                this.client.totalSongsPlayed = 0;
                this.client.timesCommandsUsed = [];
                // this.client.timesSongsPlayed = [];
                this.client.usersStats = [];
                this.client.lastUpdatedDatabase = Date.now();
            });
        }
    }

    incrementTotalSongsPlayed() {
        if (!this.client.user) return;
        this.client.statcordSongs += 1;
        this.client.totalSongsPlayed += 1;

        this.updateAll();
    }

    incrementTimesCommandUsed(command, user) {
        if (!command) return;
        this.client.totalCommandsUsed += 1;

        if (this.client.timesCommandsUsed.find(c => c.command === command)) {
            this.client.timesCommandsUsed.find(c => c.command === command).timesUsed += 1;
        }
        else {
            this.client.timesCommandsUsed.push({ command: command, timesUsed: 1 });
        }

        if (this.client.usersStats.find(u => u.id === user.id)) {
            this.client.usersStats.find(u => u.id === user.id).commandsUsed += 1;
        }
        else {
            this.client.usersStats.push({ id: user.id, username: user.username, commandsUsed: 1, songsPlayed: 0 });
        }

        this.updateAll();
    }

    // incrementTimesSongsPlayed(id, title, url, duration, platform, thumbnail, author) {
    //     if (!url) return;
    //     if (this.client.timesSongsPlayed.find(s => s.url === url)) {
    //         this.client.timesSongsPlayed.find(s => s.url === url).timesPlayed += 1;
    //     }
    //     else {
    //         this.client.timesSongsPlayed.push({ _id: url, title: title, id: id, author: author, duration: duration, thumbnail: thumbnail, platform: platform, timesPlayed: 1 });
    //     }

    //     this.updateAll();
    // }

    incrementUserSongsPlayed(user) {
        if (!user) return;
        if (this.client.usersStats.find(u => u.id === user.id)) {
            this.client.usersStats.find(u => u.id === user.id).songsPlayed += 1;
        }
        else {
            this.client.usersStats.push({ id: user.id, username: user.username, songsPlayed: 1, commandsUsed: 0 });
        }

        this.updateAll();
    }

    addToSongHistory(track, user) {
        if (!user) return;

        User.findById(user.id, async (err, u) => {
            if (err) this.client.logger.error(err);
            if (!u) return;
            const trackToAdd = {
                _id: track.id ? track.id : track.url,
                title: track.title ? track.title : 'Unknown Title',
                url: track.url,
                author: track.author ? track.author : 'Unknown Author',
                duration: track.duration,
                thumbnail: track.thumbnail,
                platform: track.platform ? track.platform : 'file',
                playable: track.playable,
            };
            if (u.songHistory.includes(trackToAdd));
            u.songHistory.unshift(trackToAdd);
            u.updateOne({ songHistory: u.songHistory }).catch(err => this.client.logger.error(err));
        });
    }

    static async getDefaultVolume(server) {
        return (await Server.findById(server.id)).defaults.volume;
    }

    static async shouldSendNowPlayingMessage(server) {
        return (await Server.findById(server.id)).nowPlayingMessages;
    }
};