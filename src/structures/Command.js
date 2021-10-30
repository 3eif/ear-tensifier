module.exports = class Command {
    constructor(client, options) {
        this.client = client;
        this.name = options.name;
        this.description = {
            content: options.description.content || 'No description provided',
            usage: options.description.usage || 'No usage provided',
            examples: options.description.examples || 'No examples provided',
        };
        this.args = options.args || false;
        this.aliases = options.aliases || 'N/A';
        this.isEnabled = options.isEnabled || true;
        this.hide = options.hide || false;
        this.cooldown = options.cooldown || 3;
        this.voiceRequirements = {
            isInVoiceChannel: options.voiceRequirements.isInVoiceChannel || false,
            isInSameVoiceChannel: options.voiceRequirements.isInSameVoiceChannel || false,
            isPlaying: options.voiceRequirements.isPlaying || false,
        };
        this.permissions = {
            permission: options.permissions.permission || 'user',
            botPermissions: options.permissions.botPermissions || [],
            userPermissions: options.permissions.userPermissions || [],
        };
    }
};