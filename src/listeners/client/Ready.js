const mongoose = require('mongoose');
const blapi = require('blapi');

const Event = require('../../structures/Event');
const Manager = require('../../structures/Manager');
const { ActivityType } = require('discord.js');

module.exports = class Ready extends Event {
    constructor(...args) {
        super(...args);
    }

    async run() {
        if (process.env.MONGO_URL) {
            mongoose.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }).then(() => this.client.logger.complete('Connected to MongoDB'));
            
            mongoose.set('strictQuery', false);
        }
        else this.client.logger.warn('MongoDB URL missing');

        const status = '/help | eartensifier.net';
        const statusType = ActivityType.Listening;
        this.client.user.setPresence({ activities: [{ name: status, type: statusType }], status: 'online' });

        this.client.music = new Manager();
        this.client.loadPlayerListeners();

        if (this.client.shard.ids[0] == this.client.shard.count - 1) {
            const guildNum = await this.client.shard.fetchClientValues('guilds.cache.size');
            const memberNum = await this.client.shard.broadcastEval(c => c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0));
            const totalMembers = memberNum.reduce((prev, memberCount) => prev + memberCount, 0);
            const totalGuilds = guildNum.reduce((total, shard) => total + shard, 0);

            this.client.logger.ready('%s is online: %s shards, %s servers, and %s members.', this.client.user.username, this.client.shard.count, totalGuilds, totalMembers);
            if (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'development') {
                try {
                    

                    require('../../api/index.js')(this.client);
                    blapi.setLogging({
                        extended: false,
                        logger: this.client.logger,
                    });

                    if (process.env.NODE_ENV == 'production') {
                        blapi.manualPost(totalGuilds, this.client.user.id, require('../../../lists.json'));
                        setInterval(async () => {
                            blapi.manualPost(totalGuilds, this.client.user.id, require('../../../lists.json'));
                        }, 1800000);
                    }
                }
                catch (err) {
                    this.client.logger.error(err.message);
                }
            }
        }
    }
};
