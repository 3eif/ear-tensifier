const Discord = require('discord.js');
const Event = require('../../structures/Event');
const post = require('../../handlers/post.js');

module.exports = class GuildCreate extends Event {
    constructor(...args) {
        super(...args);
    }

    async run() {
        try {
            this.client.shard.fetchClientValues('guilds.cache.size').then(guilds => {
                const totalGuilds = guilds.reduce((prev, guildCount) => prev + guildCount, 0);

                const embed = new Discord.MessageEmbed()
                    .setDescription(`${this.client.emojiList.added} Ear Tensifier has been added to a server.`)
                    .setFooter(`${totalGuilds} servers`)
                    .setTimestamp()
                    .setColor(this.client.colors.added);
                this.client.shardMessage(this.client, this.client.channelList.guildChannel, embed);

                return post(this.client, totalGuilds, guilds.length);
            });
        }
        catch (error) {
            return;
        }
    }
};