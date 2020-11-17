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

if (process.env.NODE_ENV == 'production') {
  const Statcord = require('statcord.js');
  // eslint-disable-next-line no-unused-vars
  const statcord = new Statcord.ShardingClient({
    key: process.env.STATCORD_TOKEN,
    manager,
  });
}

Sentry.init({
  dsn: process.env.SENTRY_URL,
  environment: process.env.SENTRY_ENVIRONMENT,
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connect(
  process.env.MONGO_URL',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    dbName: process.env.MONGO_NAME,
  },
  err => { throw err; },
);


manager.spawn().catch((err) => console.log(err));