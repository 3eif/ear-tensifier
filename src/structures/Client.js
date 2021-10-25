const Discord = require('discord.js');
const chalk = require('chalk');
const Statcord = require('statcord.js');

module.exports = class Client extends Discord.Client {
    constructor() {
        super({
            allowedMentions: { parse: ['roles'], repliedUser: false },
            makeCache: Discord.Options.cacheWithLimits({
                ...Discord.Options.defaultMakeCacheSettings,
                MessageManager: {
                    sweepInterval: 300,
                    sweepFilter: Discord.LimitedCollection.filterByLifetime({
                        lifetime: 1800,
                        getComparisonTimestamp: e => e.editedTimestamp ?? e.createdTimestamp,
                    })
                }
            }),
            partials: [
                'MESSAGE',
                'CHANNEL',
                'REACTION',
            ],
            intents: [
                'GUILDS',
                'GUILD_MESSAGES',
                'GUILD_VOICE_STATES',
                'GUILD_MESSAGE_REACTIONS',
            ],
            restTimeOffset: 0
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

        this.earTensifiers = ['472714545723342848', '888267634687213669', '888268490199433236', '669256663995514900']

        this.environment = process.env.NODE_ENV;

        // Statcord.ShardingClient.registerCustomFieldHandler(1, () => {
        //     return this.client.music.nodes.array()[0].stats.players;
        // });

        // Statcord.ShardingClient.registerCustomFieldHandler(2, () => {
        //     return this.client.music.nodes.array()[0].stats.playingPlayers;
        // });
    }

    log(msg) {
        console.log(chalk.white.bold(`[${new Date().toLocaleString()}]`) + chalk.white.bold(' > ') + msg);
    }

    async login(token = this.token) {
        super.login(token);
    }
};
