const { BaseCluster } = require('kurasuta');

module.exports = class Cluster extends BaseCluster {
    launch() {
        this.client.login(process.env.DISCORD_TOKEN);
    }
};