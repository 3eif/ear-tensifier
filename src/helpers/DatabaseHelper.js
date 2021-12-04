const Bot = require('../models/Bot');
const Song = require('../models/Song');
const User = require('../models/User');
const Server = require('../models/Server');

module.exports = class DatabaseHelper {
    constructor(client) {
        this.client = client;
        this.logger = this.client.logger;
    }

    incrementTotalCommandsUsed() {
        if (!this.client.user) return;
        Bot.findById(this.client.user.id).then(async bot => {
            if (!bot) {
                const newBot = new Bot({ _id: this.client.user.id, username: this.client.name, commands: [], commandsUsed: 1, songsPlayed: 0 });
                await newBot.save().catch(e => this.logger.error(e));
            }
            else {
                bot.updateOne({ commandsUsed: bot.commandsUsed + 1 }).catch(e => this.logger.error(e));
            }
        });
    }

    incrementTotalSongsPlayed() {
        if (!this.client.user) return;
        this.client.statcordSongs += 1;
        Bot.findById(this.client.user.id).then(async bot => {
            if (!bot) {
                const newBot = new Bot({ _id: this.client.user.id, username: this.client.name, commands: [], commandsUsed: 0, songsPlayed: 1 });
                await newBot.save().catch(e => this.logger.error(e));
            }
            else {
                bot.updateOne({ songsPlayed: bot.songsPlayed + 1 }).catch(e => this.logger.error(e));
            }
        });
    }

    incrementTimesCommandUsed(command) {
        if (!command) return;
        Bot.findById(this.client.user.id).then(async bot => {
            if (!bot) {
                const newBot = new Bot({ _id: this.client.user.id, username: this.client.name, commands: [{ _id: command.name, timesUsed: 1 }], commandsUsed: 1, songsPlayed: 0 });
                await newBot.save().catch(e => this.logger.error(e));
            }
            else {
                const commandIndex = bot.commands.findIndex(c => c._id === command.name);
                if (commandIndex === -1) {
                    bot.updateOne({ commands: [...bot.commands, { _id: command.name, timesUsed: 1 }] }).catch(e => this.logger.error(e));
                }
                else {
                    bot.updateOne({ commands: [...bot.commands.slice(0, commandIndex), { _id: command.name, timesUsed: bot.commands[commandIndex].timesUsed + 1 }, ...bot.commands.slice(commandIndex + 1)], commandsUsed: bot.commandsUsed + 1 }).catch(e => this.logger.error(e));
                }
            }
        });
    }

    incrementTimesSongPlayed(id, title, url, duration, platform, thumbnail, author) {
        if (!url) return;
        Song.findById(url).then(async s => {
            if (!s) {
                const newSong = new Song({ _id: url, title: title, id: id, author: author, duration: duration, thumbnail: thumbnail, platform: platform, timesPlayed: 1 });
                await newSong.save().catch(e => this.logger.error(e));
            }
            else {
                s.updateOne({ timesPlayed: s.timesPlayed + 1 }).catch(e => this.logger.error(e));
            }
        });
    }

    incrementUserSongsPlayed(user) {
        if (!user) return;
        User.findById(user.id).then(async u => {
            if (!u) {
                const newUser = new User({ _id: user.id, username: user.username, songsPlayed: 1 });
                await newUser.save().catch(e => this.logger.error(e));
            }
            else {
                u.updateOne({ songsPlayed: u.songsPlayed + 1 }).catch(e => this.logger.error(e));
            }
        });
    }

    static async getDefaultVolume(server) {
        return (await Server.findById(server.id)).defaults.volume;
    }

    static async shouldSendNowPlayingMessage(server) {
        return (await Server.findById(server.id)).nowPlayingMessages;
    }
};