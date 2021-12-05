/* eslint-disable no-console */
const { ShardingManager } = require('discord.js');
const config = require('./config.json');

const manager = new ShardingManager('./tests/bot.js', { token: config.token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();