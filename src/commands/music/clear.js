const Command = require('../../structures/Command');

module.exports = class Clear extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            description: {
                content: 'Clears all the songs in the queue.',
            },
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
        console.log(player.queue.length);
        player.queue.clear();

        return message.channel.send('Cleared the queue.');
    }

    async execute(client, interaction) {
        const player = client.music.players.get(interaction.guild.id);
        player.queue.clear();

        await interaction.reply('Cleared the queue.');
    }
};
