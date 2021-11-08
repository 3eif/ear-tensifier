const Server = require('../models/server.js');
const User = require('../models/user.js');

module.exports = class MessageHelper {
    constructor(client, message) {
        this.client = client;
        this.message = message;
    }

    async getServer() {
        this.server = await Server.findOne({ serverID: this.message.guild.id });
        if (!this.server) {
            const newServer = new Server({
                serverID: this.message.guild.id,
                prefix: this.client.config.prefix,
                ignore: [],
            });
            await newServer.save();
            this.server = newServer;
        }
    }

    async getUser() {
        this.user = await User.findOne({ authorID: this.message.author.id });
        if (!this.user) {
            const newUser = new User({
                authorID: this.message.author.id,
                bio: '',
                songsPlayed: 0,
                commandsUsed: 1,
                blocked: false,
                premium: false,
                pro: false,
                developer: false,
            });
            await newUser.save().catch(e => this.client.log(e));
            this.user = await User.findOne({ authorID: this.message.author.id });
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

    isIgnored() {
        return this.server.ignore.includes(this.message.channel.id);
    }

    sendResponse(type) {
        switch (type) {
            case 'sameVoiceChannel': {
                this.message.channel.send('You are not in the same voice channel as the bot.');
                break;
            }
            case 'noVoiceChannel': {
                this.message.channel.send('You need to be in a voice channel to use this command.');
                break;
            }
            case 'noSongsPlaying': {
                this.message.channel.send('There are no songs currently playing, please play a song to use the command.');
                break;
            }
            case 'botVoiceChannel': {
                this.message.channel.send('The bot is not currently in a vc.');
                break;
            }
            case 'noPermissionConnect': {
                this.message.channel.send('I do not have permission to join your voice channel.');
                break;
            }
            case 'noPermissionSpeak': {
                this.message.channel.send('I do not have permission to speak in your voice channel.');
                break;
            }
            case 'noUser': {
                this.message.channel.send('Please provide a valid user.');
                break;
            }
            default: {
                this.message.channel.send(this.client.error());
            }
        }
    }
};