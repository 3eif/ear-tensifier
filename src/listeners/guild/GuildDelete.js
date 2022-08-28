const { EmbedBuilder } = require('discord.js');
const Event = require('../../structures/Event');

module.exports = class GuildDelete extends Event {
    constructor(...args) {
        super(...args);
    }

    async run() {
        try {
            this.client.shard.fetchClientValues('guilds.cache.size').then(guilds => {
                const totalGuilds = guilds.reduce((prev, guildCount) => prev + guildCount, 0);

                const embed = new EmbedBuilder()
                    .setDescription(`${this.client.config.emojis.removed} Ear Tensifier has been removed from a server.`)
                    .setFooter({ name: `${totalGuilds} servers` })
                    .setTimestamp()
                    .setColor(this.client.config.colors.removed);
                if (this.client.earTensifiers.includes(this.client.user.id))
                    this.client.shard.broadcastEval(shardMessage, { context: { channel: this.client.config.channels.guildlogs, embed: embed, isShard: true } });
            });
        }
        catch (error) {
            this.client.logger.error(error);
        }

        function shardMessage(c, { channel, embed, isShard }) {
            c.shardMessage(channel, embed, isShard);
        }
    }
};