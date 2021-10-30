const Discord = require('discord.js');

module.exports = class Client extends Discord.Client {
    constructor(options) {
        super({ ...options });
    }

    async login(token = this.token) {
        super.login(token);
    }
};