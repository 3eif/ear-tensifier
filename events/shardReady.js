const { ErelaClient, Utils } = require("erela.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const Discord = require('discord.js');
const Event = require('./Event');
const { nodes } = require("../tokens.json");
const channel = require("../data/channels.json");

module.exports = class ShardReady extends Event {
    constructor(...args) {
        super(...args)
    }

    async run() {
        let i = parseInt(this.client.shard.ids) + 1;
        console.log(`Shard [${i}] ready`)
    }
}