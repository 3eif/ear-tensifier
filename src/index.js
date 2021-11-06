const { ShardingManager } = require('kurasuta');
const { join } = require('path');
const { isPrimary } = require('cluster');
const { AutoPoster } = require('topgg-autoposter');
const { init } = require('@sentry/node');
const mongoose = require('mongoose');
const Discord = require('discord.js');
require('custom-env').env(true);

const Client = require('./structures/Client');

const manager = new ShardingManager(join(__dirname, 'structures', 'Cluster'), {
    client: Client,
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

    if (process.env.NODE_ENV === 'production') {
        if (process.env.TOPGG_TOKEN) {
            const poster = AutoPoster(process.env.TOPGG_TOKEN, manager);
            poster.on('posted', (stats) => {
                console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
            });
        }
    }

    if (process.env.NODE_ENV !== 'development' && process.env.SENTRY_URL) {
        init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV,
            release: require('../package.json').version,
        });
    }
}


manager.spawn().catch((err) => console.log(err));