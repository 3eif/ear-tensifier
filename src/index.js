/* eslint-disable no-console */
const { ShardingManager } = require('kurasuta');
const { isPrimary } = require('cluster');
const { AutoPoster } = require('topgg-autoposter');
const Sentry = require('@sentry/node');
const path = require('path');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const figlet = require('figlet');
const Statcord = require('statcord.js');

require('custom-env').env(true);
require('events').defaultMaxListeners = 15;

const Logger = require('./structures/Logger');
const Client = require('./structures/Client');

const logger = new Logger({
    displayTimestamp: true,
    displayDate: true,
});

const manager = new ShardingManager(path.join(__dirname, 'structures', 'Cluster'), {
    client: Client,
    respawn: false,
    // clusterCount: 3,
    // shardCount: 4,
    clientOptions: {
        allowedMentions: { parse: ['roles'], repliedUser: false },
        makeCache: Discord.Options.cacheWithLimits({
            ...Discord.Options.defaultMakeCacheSettings,
            MessageManager: {
                sweepInterval: 300,
                sweepFilter: Discord.LimitedCollection.filterByLifetime({
                    lifetime: 1800,
                    getComparisonTimestamp: e => e.editedTimestamp || e.createdTimestamp,
                }),
            },
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
        restTimeOffset: 0,
    },
    token: process.env.DISCORD_TOKEN,
});

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

if (isPrimary) {
    console.log(figlet.textSync(process.env.CLIENT_USERNAME));
    if (process.env.NODE_ENV == 'production') {
        if (process.env.TOPGG_TOKEN) {
            const poster = AutoPoster(process.env.TOPGG_TOKEN, manager);
            poster.on('posted', (stats) => {
                logger.complete('Posted stats to Top.gg: %d servers, %d shards', stats.serverCount, stats.shardCount);
            });
        }
        else logger.warn('Top.gg token missing');

        if (process.env.STATCORD_TOKEN) {
            const statcord = new Statcord.ShardingClient({
                key: process.env.STATCORD_TOKEN,
                manager,
                postCpuStatistics: true,
                postMemStatistics: true,
                postNetworkStatistics: true,
                autopost: true,
            });

            statcord.on('post', status => {
                if (!status) logger.complete('Posted stats to statcord.com');
                else logger.error(status);
            });
        }
        else logger.warn('Statcord token missing');
    }

    if (process.env.NODE_ENV != 'development') {
        if (process.env.SENTRY_DSN) {
            Sentry.init({
                dsn: process.env.SENTRY_DSN,
                environment: process.env.NODE_ENV,
                release: require('../package.json').version,
                tracesSampleRate: 0.5,
            });
            logger.complete('Connected to Sentry');
        }
        else logger.warn('Sentry dsn missing.');
    }
}

manager.spawn().catch((err) => logger.error(err));
const ClusterMessage = require('./listeners/cluster/ClusterMessage');
manager.on('message', (message) => new ClusterMessage(this, ClusterMessage).run(manager, message));