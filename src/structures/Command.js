module.exports = class Command {
  constructor(client, options) {
    this.client = client;
    this.name = options.name;
    this.args = options.args || false;
    this.usage = options.usage || 'No usage provided';
    this.description = options.description || 'No description provided';
    this.aliases = options.aliases || 'N/A';
    this.enabled = options.enabled || true;
    this.cooldown = options.cooldown || 3;
    this.permission = options.permission || 'user';
    this.voteLocked = options.voteLocked || false;
    this.inVoiceChannel = options.inVoiceChannel || false;
    this.sameVoiceChannel = options.sameVoiceChannel || false;
    this.playing = options.playing || false;
    this.botPermissions = options.botPermissions || [];
  }
};