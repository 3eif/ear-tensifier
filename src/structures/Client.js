const Discord = require('discord.js');
const fs = require('fs');

const commandsFolder = fs.readdirSync('./src/commands/');
const listernsFolder = fs.readdirSync('./src/listeners/');
const Logger = require('./Logger.js');

module.exports = class Client extends Discord.Client {
    constructor(options) {
        super({ ...options });

        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();

        this.logger = new Logger(this, {
            displayTimestamp: true,
            displayDate: true,
        });
    }

    loadCommands() {
        commandsFolder.forEach(category => {
            const categories = fs.readdirSync(`./src/commands/${category}/`).filter(file => file.endsWith('.js'));
            categories.forEach(command => {
                const cmd = require(`../commands/${category}/${command}`);
                this.commands.set(cmd.data.name, cmd);
            });
        });
        console.log(this.commands);
    }

    loadListeners() {
        listernsFolder.forEach(async (eventFolder) => {
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