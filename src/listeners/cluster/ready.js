const { MessageEmbed } = require('discord.js');

const Manager = require('../../structures/Manager');
const Event = require('../../structures/Event');
const formatDuration = require('../../utils/music/formatDuration.js');

module.exports = class Ready extends Event {
    constructor(...args) {
        super(...args);
    }

    async run() {
        this.client.logger.ready('Cluster %d ready', this.client.shard.id);

        this.client.music = new Manager()
            .on('trackStart', (player, track) => {
                const embed = new MessageEmbed()
                    .setColor(this.client.config.colors.default)
                    .setAuthor('Now Playing', 'https://cdn.discordapp.com/emojis/673357192203599904.gif?v=1')
                    .setThumbnail(track.thumbnails[0].url)
                    .setDescription(`**[${track.title}](${this.client.config.urls.youtube + track.id})** [${formatDuration(track.duration)}]`)
                    .addField('Author', track.owner_name, true)
                    .addField('Requested by', `<@${track.requester.id}>`, true)
                    .setFooter(track.platform)
                    .setTimestamp();
                player.textChannel.send({ embeds: [embed] });
            })
            .on('trackEnd', (player, track) => {
                console.log('finished song');
            })
            .on('queueEnd', (player, track) => {
                console.log('queue ended');
            })
            .on('error', (e) => {
                console.log(e);
            });

        if (this.client.shard.id == this.client.shard.clusterCount - 1) {
            this.client.logger.ready('Ear Tensifier is ready');
        }
    }
};