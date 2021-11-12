const Server = require('../models/Server.js');
const User = require('../models/User.js');
const Command = require('../models/command');

module.exports = class MessageHelper {
    constructor(client, ctx) {
        this.client = client;
        this.ctx = ctx;
    }

    async getServer() {
        this.server = await Server.findOne(this.ctx.guild.id);
        if (!this.server) {
            const newServer = new Server({
                _id: this.ctx.guild.id,
                prefix: this.client.config.prefix,
                ignore: [],
            });
            await newServer.save();
            this.server = newServer;
        }
    }

    async getUser() {
        this.user = await User.findById(this.ctx.author.id);
        if (!this.user) {
            const newUser = new User({
                _id: this.ctx.author.id,
                bio: '',
                songsPlayed: 0,
                commandsUsed: 1,
                blocked: false,
                premium: false,
                pro: false,
                developer: false,
            });
            await newUser.save().catch(e => this.client.log(e));
            this.user = await User.findOne({ authorID: this.ctx.author.id });
        }
    }

    async getPrefix(rawMessageContent, mentionPrefix) {
        if (rawMessageContent.indexOf(this.client.config.prefix) === 0) {
            return this.client.config.prefix;
        }
        else if (rawMessageContent.indexOf(this.server.prefix.toLowerCase()) === 0) {
            return this.server.prefix;
        }
        else if (rawMessageContent.split(' ')[0].match(mentionPrefix)) {
            return mentionPrefix;
        }
        else {
            return undefined;
        }
    }

    async isBlacklisted() {
        if (this.user.blocked == null) this.user.blocked = false;
        if (!this.user.blocked) {
            this.user.commandsUsed += 1;
        }
        await this.user.save().catch(e => console.error(e));
        return this.user.blocked;
    }

    async incrementCommandCount(command) {
        const commandName = command.toLowerCase();
        Command.findOne({ commandName: commandName }).then(async c => {
            if (!c) {
                const newCommand = new Command({
                    commandName: commandName,
                    timesUsed: 1,
                });
                await newCommand.save().catch(e => this.client.logger.error(e));
            }
            else {
                c.timesUsed += 1;
                await c.save().catch(e => this.client.logger.error(e));
            }
        });
    }

    isIgnored() {
        return this.server.ignore.includes(this.ctx.channel.id);
    }

    sendResponse(type) {
        switch (type) {
            case 'sameVoiceChannel': {
                this.ctx.sendMessage('You are not in the same voice channel as the bot.');
                break;
            }
            case 'noVoiceChannel': {
                this.ctx.sendMessage('You need to be in a voice channel to use this command.');
                break;
            }
            case 'noSongsPlaying': {
                this.ctx.sendMessage('There are no songs currently playing, please play a song to use the command.');
                break;
            }
            case 'botVoiceChannel': {
                this.ctx.sendMessage('The bot is not currently in a vc.');
                break;
            }
            case 'noPermissionConnect': {
                this.ctx.sendMessage('I do not have permission to join your voice channel.');
                break;
            }
            case 'noPermissionSpeak': {
                this.ctx.sendMessage('I do not have permission to speak in your voice channel.');
                break;
            }
            case 'noUser': {
                this.ctx.sendMessage('Please provide a valid user.');
                break;
            }
            default: {
                this.ctx.sendMessage(this.client.error());
            }
        }
    }
};