const { ShardingManager } = require('kurasuta');
const { join } = require('path');
const Client = require('./structures/Client');
const Discord = require('discord.js');

const sharder = new ShardingManager(join(__dirname, 'structures', 'Cluster'), {
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

sharder.on('debug', message => {
    console.log(message);
});

sharder.spawn().catch((err) => console.log(err));