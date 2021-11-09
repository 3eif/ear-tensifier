const Discord = require('discord.js');
const fs = require('fs');

const commandsFodler = fs.readdirSync('./src/commands/');
const listenersFolder = fs.readdirSync('./src/listeners/');
const Logger = require('./Logger.js');
const Bot = require('../models/bot');
const Manager = require('./Manager.js');
const formatDuration = require('../utils/music/formatDuration.js');

module.exports = class Client extends Discord.Client {
    constructor(options) {
        super({ ...options });

        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();

        this.logger = new Logger(this, {
            displayTimestamp: true,
            displayDate: true,
        });

        this.config = require('../../config.json');
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

    incrementCommandsUsed() {
        Bot.findOne({ clientID: this.user.id }).then(async b => {
            if (!b) {
                const newClient = new Bot({
                    clientID: this.user.id,
                    clientName: this.user.name,
                    commandsUsed: 0,
                    songsPlayed: 0,
                });
                await newClient.save().catch(e => this.logger.error(e));
                b = await Bot.findOne({ clientID: this.user.id });
            }

            b.commandsUsed += 1;
            b.save().catch(e => this.logger.error(e));
        });
    }

    createManager() {
        return new Manager()
            .on('trackStart', (player, track) => {
                const embed = new Discord.MessageEmbed()
                    .setColor(this.config.colors.default)
                    .setAuthor('Now Playing', 'https://cdn.discordapp.com/emojis/673357192203599904.gif?v=1')
                    .setThumbnail(track.thumbnails[0].url)
                    .setDescription(`**[${track.title}](${this.config.urls.youtube + track.id})** [${formatDuration(track.duration)}]`)
                    .addField('Author', track.owner_name, true)
                    .addField('Requested by', `<@${track.requester.id}>`, true)
                    .setFooter(track.platform)
                    .setTimestamp();
                player.textChannel.send({ embeds: [embed] });
            })
            .on('trackEnd', (player, track) => {
                console.log('finished song');
            })
            .on('queueEnd', (player, track) => {
                console.log('queue ended');
            })
            .on('error', (e) => {
                console.log(e);
            });
    }

    async login(token = this.token) {
        super.login(token);

        this.loadCommands();
        this.loadListeners();
    }
};