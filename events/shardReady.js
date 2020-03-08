const { ErelaClient, Utils } = require("erela.js");
const emojis = require("../recourses/emojis.json");
const colors = require("../recourses/colors.json");
const Discord = require('discord.js');
const Event = require('../structures/Event');
const { nodes } = require("../tokens.json");
const channel = require("../recourses/channels.json");

module.exports = class ShardReady extends Event {
    constructor(...args) {
        super(...args)
    }

    async run() {
        let i = parseInt(this.client.shard.ids) + 1;
        console.log(`Shard [${i}] ready`)
    }
}