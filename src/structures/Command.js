module.exports = class Command {
  constructor(client, options) {
    this.client = client;
    this.name = options.name;
    this.args = options.args || false;
    this.usage = options.usage || 'No usage provided';
    this.description = options.description || 'No description provided';
    this.aliases = options.aliases || 'No aliases for this certain command';
    this.enabled = options.enabled || true;
    this.cooldown = options.cooldown || 3;
    this.permission = options.permission || 'user';
    this.inVoiceChannel = options.inVoiceChannel || false;
    this.sameVoiceChannel = options.sameVoiceChannel || false;
    this.playing = options.playing || false;
  }

  // reload() {
  //   const path = `../commands/${this.name}.js`;
  //   delete require.cache[path];
  //   const command = require(`../commands/${this.name}.js`);
  //   this.client.commands.set(command);
  //   this.client.aliases.set(command.aliases);
  // }
};