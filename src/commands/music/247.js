const Command = require('../../structures/Command');

module.exports = class TwentyFourSeven extends Command {
    constructor(client) {
        super(client, {
            name: '247',
            description: {
                content: 'Stays in the voice channel even if no one is in it.',
            },
            aliases: ['stay', '247', '24-7', '24seven', '24-7mode', 'twentyfourseven'],
            voiceRequirements: {
                isInVoiceChannel: true,
            },
            slashCommand: true,
        });
    }
    async run(client, ctx) {
        const player = client.music.players.get(ctx.guild.id);
        if (!player) return ctx.sendMessage('There are no songs currently playing, please play a song to use the command.');

        if (player.stayInVoice) {
            player.stayInVoice = false;
            if (!player.playing) player.destroy();
            return ctx.sendMessage('24/7 mode is now off.');
        }
        else {
            player.stayInVoice = true;
            return ctx.sendMessage('24/7 mode is now on.');
        }
    }
};
