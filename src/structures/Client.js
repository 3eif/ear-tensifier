const Discord = require('discord.js');
const fs = require('fs');

const commandsFodler = fs.readdirSync('./src/commands/');
const listenersFolder = fs.readdirSync('./src/listeners/');
const Logger = require('./Logger.js');

module.exports = class Client extends Discord.Client {
    constructor(options) {
        super({ ...options });

        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();

        this.logger = new Logger(this, {
            displayTimestamp: true,
            displayDate: true
        });
    }

    loadCommands() {
        commandsFodler.forEach(category => {
            const categories = fs.readdirSync(`./src/commands/${category}/`);
            categories.forEach(command => {
                const f = require(`../commands/${category}/${command}`);
                const cmd = new f(this, f);
                this.commands.set(cmd.name, cmd);
            });
        });
    }

    loadListeners() {
        listenersFolder.forEach(async (eventFolder) => {
            const events = fs.readdirSync(`./src/listeners/${eventFolder}`).filter(c => c.split('.').pop() === 'js');
            events.forEach(async (eventStr) => {
                if (!events.length) throw Error('No event files found!');
                const file = require(`../listeners/${eventFolder}/${eventStr}`);
                const event = new file(this, file);
                this.on(eventStr.split('.')[0], (...args) => event.run(...args));
            });
        });
    }

    async login(token = this.token) {
        super.login(token);

        this.loadCommands();
        this.loadListeners();
    }
};