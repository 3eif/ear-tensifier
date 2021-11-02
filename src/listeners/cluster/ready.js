const Manager = require('../../structures/Manager');
const Event = require('../../structures/Event');

module.exports = class Ready extends Event {
    constructor(...args) {
        super(...args);
    }

    async run() {
        this.client.logger.ready('Cluster %d ready', this.client.shard.id);

        this.client.music = new Manager()
            .on('trackStart', (player) => {
                player.textChannel.send(`Now playing: **${player.queue.current.title}**`);
            })
            .on('trackEnd', (player, track) => {
                console.log('finished song');
            })
            .on('error', (e) => {
                console.log(e);
            });

        if (this.client.shard.id == this.client.shard.clusterCount - 1) {
            this.client.logger.ready('Ear Tensifier is ready');
        }
    }
};