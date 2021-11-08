const Command = require('../../structures/Command');

module.exports = class Pause extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            description: {
                content: 'Pauses the current song.',
            },
            aliases: ['stop'],
            args: false,
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            slashCommand: true,
        });
    }

    async run(client, message) {
        const player = client.music.players.get(message.guild.id);

        player.pause(player.playing);
        return message.channel.send(`Song is now **${player.playing ? 'resumed' : 'paused'}.**`);
    }

    async execute(client, interaction) {
        const msg = await interaction.deferReply({ fetchReply: true });
        await interaction.editReply(`Pong! (Latency: ${msg.createdTimestamp - interaction.createdTimestamp}ms. API Latency: ${Math.round(client.ws.ping)}ms.)`);
    }
};
