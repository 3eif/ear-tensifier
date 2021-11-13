module.exports = class Command {
    constructor(client, options) {
        this.client = client;
        this.name = options.name;
        this.description = {
            content: options.description ? (options.description.content || 'No description provided') : 'No description provided',
            usage: options.description ? (options.description.usage || 'No usage provided') : 'No usage provided',
            examples: options.description ? (options.description.examples || 'No examples provided') : 'No examples provided',
        };
        this.args = options.args || false;
        this.aliases = options.aliases || 'N/A';
        this.isEnabled = options.isEnabled || true;
        this.hide = options.hide || false;
        this.cooldown = options.cooldown || 3;
        this.voiceRequirements = {
            isInVoiceChannel: options.voiceRequirements ? (options.voiceRequirements.isInVoiceChannel || false) : false,
            isInSameVoiceChannel: options.voiceRequirements ? (options.voiceRequirements.isInSameVoiceChannel || false) : false,
            isPlaying: options.voiceRequirements ? (options.voiceRequirements.isPlaying || false) : false,
        };
        this.permissions = {
            dev: options.permissions ? (options.permissions.dev || false) : false,
            botPermissions: options.permissions ? (options.permissions.botPermissions || []) : [],
            userPermissions: options.permissions ? (options.permissions.userPermissions || []) : [],
        };
        this.options = options.options || [];
        this.slashCommand = options.slashCommand || false;
        this.guildOnly = options.guildOnly || false;
    }
};