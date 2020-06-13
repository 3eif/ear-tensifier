const Discord = require('discord.js');
const DBL = require('dblapi.js');

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

        this.shardMessage = require('./../utils/shardMessage.js');
        this.responses = require('./../utils/responses.js');
        this.errors = require('./../utils/errors.js');

        this.environment = process.env.NODE_ENV;

        // this.dbl = new DBL(process.env.TOPGG_TOKEN, this);
    }

    log(msg) {
        console.log(`[${new Date().toLocaleString()}] > ${msg}`);
    }

    async login(token = this.token) {
        super.login(token);
    }
};