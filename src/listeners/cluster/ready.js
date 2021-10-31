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
                console.log(player);
                player.textChannel.send(`Now playing: **${player.queue.current.title}**`);
            })
            .on('trackEnd', (player) => {
                console.log('finished song');
            });

        if (this.client.shard.id == this.client.shard.clusterCount - 1) {
            this.client.logger.ready('Ear Tensifier is ready');
        }
    }
};