module.exports = class Cluster {
    launch() {
        this.client.login(process.env.DISCORD_TOKEN);
    }
};