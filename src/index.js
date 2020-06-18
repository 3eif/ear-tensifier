const { ShardingManager } = require('discord.js');
const Sentry = require('@sentry/node');
const mongoose = require('mongoose');
process.env.NODE_ENV || (process.env.NODE_ENV = 'production');
require('dotenv-flow').config();

const manager = new ShardingManager('./src/eartensifier.js', {
  token: process.env.DISCORD_TOKEN,
  totalShards: 'auto',
  shardList: 'auto',
  mode: 'process',
  respawn: 'true',
  timeout: 999999,
});

if(process.env.NODE_ENV == 'production') {
  const Statcord = require('statcord.js-beta');
  new Statcord.ShardingClient(process.env.STATCORD_TOKEN, manager);
}

Sentry.init({
  dsn: process.env.SENTRY_URL,
  environment: process.env.SENTRY_ENVIRONMENT,
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

manager.on('launch', shard => {
  console.log(`Shard [${shard.id}] launched`);
  shard.on('death', () => console.log(`Shard [${shard.id}] died`))
    .on('ready', () => console.log(`Shard [${shard.id}] ready`))
    .on('disconnect', () => console.log(`Shard [${shard.id}] disconnected`))
    .on('reconnecting', () => console.log(`Shard [${shard.id}] reconnecting`));
});

manager.spawn().catch((err) => console.log(err));