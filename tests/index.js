/* eslint-disable no-console */
const { ShardingManager } = require('discord.js');
require('custom-env').env(true);

const manager = new ShardingManager('./tests/bot.js', { token: process.env.DISCORD_TOKEN });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();