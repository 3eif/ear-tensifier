const Discord = require('discord.js');
const fs = require('fs');

const commandsFodler = fs.readdirSync('./src/commands/');
const listenersFolder = fs.readdirSync('./src/listeners/');
const Logger = require('./Logger.js');
const DatabaseHelper = require('../helpers/DatabaseHelper.js');

module.exports = class Client extends Discord.Client {
    constructor(options) {
        super({ ...options });

        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();

        this.logger = new Logger({
            displayTimestamp: true,
            displayDate: true,
        });

        this.databaseHelper = new DatabaseHelper(this);

        this.config = require('../../config.json');
    }

    loadCommands() {
        commandsFodler.forEach(category => {
            const categories = fs.readdirSync(`./src/commands/${category}/`);
            categories.forEach(command => {
                const f = require(`../commands/${category}/${command}`);
                const cmd = new f(this, f);
                this.commands.set(cmd.name, cmd);
                if (cmd.aliases && Array.isArray(cmd.aliases)) {
                    for (const alias of cmd.aliases) {
                        this.aliases.set(alias, cmd);
                    }
                }
            });
        });
    }

    loadListeners() {
        listenersFolder.forEach(async (eventFolder) => {
            const events = fs.readdirSync(`./src/listeners/${eventFolder}`).filter(c => c.split('.').pop() === 'js');
            if (eventFolder != 'player') {
                events.forEach(async (eventStr) => {
                    if (!events.length) throw Error('No event files found!');
                    const file = require(`../listeners/${eventFolder}/${eventStr}`);
                    const event = new file(this, file);
                    const eventName = eventStr.split('.')[0].charAt(0).toLowerCase() + eventStr.split('.')[0].slice(1);
                    this.on(eventName, (...args) => event.run(...args));
                });
            }
        });
    }

    loadPlayerListeners() {
        const events = fs.readdirSync('./src/listeners/player').filter(c => c.split('.').pop() === 'js');
        events.forEach(async (eventStr) => {
            if (!events.length) throw Error('No event files found!');
            const file = require(`../listeners/player/${eventStr}`);
            const event = new file(this, file);
            const eventName = eventStr.split('.')[0].charAt(0).toLowerCase() + eventStr.split('.')[0].slice(1);
            this.music.on(eventName, (...args) => event.run(...args));
        });
    }

    reloadCommand(categoryName, commandName) {
        try {
            const command = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) return;

            const commandFileName = command.name.charAt(0).toUpperCase() + command.name.slice(1);
            delete require.cache[require.resolve(`../commands/${categoryName}/${commandFileName}.js`)];
            this.commands.delete(command.name);

            const newFile = require(`../commands/${categoryName}/${commandFileName}.js`);
            const newCommand = new newFile(this, newFile);
            this.commands.set(newCommand.name, newCommand);
            if (newCommand.aliases && Array.isArray(newCommand.aliases)) {
                for (const alias of newCommand.aliases) {
                    this.aliases.set(alias, newCommand);
                }
            }
        }
        catch (error) {
            this.logger.error(error);
        }
    }

    async login(token = this.token) {
        super.login(token);

        this.loadCommands();
        this.loadListeners();
    }
};