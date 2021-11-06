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
};