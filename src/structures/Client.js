const Discord = require('discord.js');
const fs = require('fs');

const commands = fs.readdirSync('./src/commands/');
const listeners = fs.readdirSync('./src/listeners/');

module.exports = class Client extends Discord.Client {
    constructor(options) {
        super({ ...options });

        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();

        console.log(this.commands);
    }

    loadCommands() {
        commands.forEach(category => {
            const categories = fs.readdirSync(`./src/commands/${category}/`);
            categories.forEach(command => {
                const cmd = require(`../commands/${category}/${command}`);
                this.commands.set(cmd.name, cmd);
            });
        });
    }

    loadListeners() {
        listeners.forEach(async (eventFolder) => {
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