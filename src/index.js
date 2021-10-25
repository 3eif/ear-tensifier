const { ShardingManager } = require('discord.js');
const Sentry = require('@sentry/node');
const mongoose = require('mongoose');
process.env.NODE_ENV || (process.env.NODE_ENV = 'production');
require('dotenv-flow').config();
require('custom-env').env();
const { AutoPoster } = require('topgg-autoposter');

const manager = new ShardingManager('./src/eartensifier.js', {
  token: process.env.DISCORD_TOKEN,
});

if (process.env.NODE_ENV === 'production') {
  if (process.env.STATCORD_TOKEN) {
    const poster = AutoPoster(process.env.STATCORD_TOKEN, manager);
    poster.on('posted', (stats) => {
      console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
    });
  }

  if (process.env.STATCORD_TOKEN) {
    const Statcord = require('statcord.js');
    // eslint-disable-next-line no-unused-vars
    const statcord = new Statcord.ShardingClient({
      key: process.env.STATCORD_TOKEN,
      manager,
      postCpuStatistics: true,
      postMemStatistics: true, 
      postNetworkStatistics: true, 
      autopost: true 
    });
  }
}

if (process.env.NODE_ENV != 'development') {
  Sentry.init({
    dsn: process.env.SENTRY_URL,
    environment: process.env.SENTRY_ENVIRONMENT,
  });
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

manager.spawn().catch((err) => console.log(err));