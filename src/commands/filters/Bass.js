const Command = require('../../structures/Command');

module.exports = class Bass extends Command {
    constructor(client) {
        super(client, {
            name: 'bass',
            description: {
                content: 'bass',
            },
            voiceRequirements: {
                inVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            slashCommand: true,
        });
    }
    async run(client, ctx) {
        const player = client.music.players.get(ctx.guild.id);

        player.setEqualizer([
            {
                band: 32,
                gain: 10,
            },
            {
                band: 64,
                gain: 10,
            },
            {
                band: 125,
                gain: 10,
            },
            {
                band: 250,
                gain: 10,
            },
            {
                band: 500,
                gain: 10,
            },
        ]);
    }
};
