const Discord = require('discord.js');
const chalk = require('chalk');

module.exports = class Client extends Discord.Client {
    constructor() {
        super({
            disableMentions: 'everyone',
            messageCacheMaxSize: 50,
            messageCacheLifetime: 60,
            messageSweepInterval: 120,
            partials: [
                'MESSAGE',
                'CHANNEL',
                'REACTION',
            ],
            ws: {
                intents: [
                    'GUILDS',
                    'GUILD_MESSAGES',
                    'GUILD_VOICE_STATES',
                    'GUILD_MESSAGE_REACTIONS',
                ],
            },
        });

        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();

        this.settings = require('../settings.js');
        this.channelList = require('../../config/channels.js');
        this.filters = require('../../config/filters.js');
        this.colors = require('../../config/colors.js');
        this.emojiList = require('../../config/emojis.js');

        this.shardMessage = require('../utils/misc/shardMessage.js');
        this.responses = require('../utils/misc/responses.js');
        this.errors = require('../utils/misc/errors.js');
        this.formatDuration = require('./../utils/music/formatDuration.js');
        this.setFilter = require('./../utils/music/setFilter.js');
        this.queuedEmbed = require('./../utils/music/queuedEmbed.js');
        this.songLimit = require('./../utils/music/songLimit.js');
        this.getSongLimit = require('./../utils/music/getSongLimit.js');

        this.environment = process.env.NODE_ENV;
    }

    log(msg) {
        console.log(chalk.white.bold(`[${new Date().toLocaleString()}]`) + chalk.white.bold(' > ') + msg);
    }

    async login(token = this.token) {
        super.login(token);
    }
};