const { ErelaClient, Utils } = require("erela.js");

;
const Discord = require('discord.js');
const Event = require('../structures/Event');
const { nodes } = require("../tokens.json");
;

module.exports = class ShardReady extends Event {
    constructor(...args) {
        super(...args)
    }

    async run() {
        let i = parseInt(this.client.shard.ids) + 1;
        console.log(`Shard [${i}] ready`)
    }
}