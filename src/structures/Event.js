module.exports = class Event {
    constructor(client, file, options = {}) {
        this.client = client;
        this.name = options.name || file.name;
        this.file = file;
    }

    async _run(...args) {
        try {
            await this.run(...args);
        }
        catch (err) {
            this.client.logger.error(err);
        }
    }

    reload() {
        const path = `../listeners/${this.name}.js`;
        delete require.cache[path];
        require(`../listeners/${this.name}.js`);
    }
};