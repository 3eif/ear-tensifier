const { Structure } = require("erela.js");
const Queue = require('./Queue');

module.exports = Structure.extend('Player', Player => {
    class player extends Player {
        constructor(...args) {
            super(...args);
            this.twentyFourSeven = false;
            this.previous = null;
            this.timeout = null;
            this.queue = new Queue();
        }

        setFilter(op, body = {}) {
            this.node.send({
                op: op,
                guildId: this.guild.id || this.guild,
                ...body,
            });
            return this;
        }
    }
    return player;
});