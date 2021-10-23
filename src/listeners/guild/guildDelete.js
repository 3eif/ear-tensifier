const { MessageEmbed } = require('discord.js');
const Event = require('../../structures/Event');
const post = require('../../handlers/post.js');

module.exports = class GuildDelete extends Event {
    constructor(...args) {
        super(...args);
    }

    async run() {
        try {
            this.client.shard.fetchClientValues('guilds.cache.size').then(guilds => {
                const totalGuilds = guilds.reduce((prev, guildCount) => prev + guildCount, 0);

                const embed = new MessageEmbed()
                    .setDescription(`${this.client.emojiList.removed} Ear Tensifier has been removed from a server.`)
                    .setFooter(`${totalGuilds} servers`)
                    .setTimestamp()
                    .setColor(this.client.colors.removed);
                if (this.client.earTensifiers.includes(this.client.user.id))
                    this.client.shardMessage(this.client, this.client.channelList.guildChannel, embed);
            });
        }
        catch (error) {
            return;
        }
    }
};