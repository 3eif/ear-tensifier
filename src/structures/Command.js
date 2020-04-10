class Command {
    constructor(client, {
      name = null,
      description = 'No description has been provided.',
      usage = 'No usage has been provided.',
      enabled = true,
      aliases = new Array(),
      cooldown = 3,
      args = false,
      dev = false,
      inVoiceChannel = false,
      sameVoiceChannel = false,
      playing = false,
    }) {
      this.client = client;
      this.conf = { enabled, aliases, cooldown, args, dev, sameVoiceChannel, inVoiceChannel, playing };
      this.help = { name, description, usage };
    }
  }

  module.exports = Command;