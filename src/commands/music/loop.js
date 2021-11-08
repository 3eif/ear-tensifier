const Command = require('../../structures/Command');

module.exports = class Loop extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            description: 'Repeats the current queue/song.',
            aliases: ['repeat', 'unloop'],
            usage: '<queue/song>',
            cooldown: '4',
            voiceRequirements: {
                isInVoiceChannel: true,
                isInSameVoiceChannel: true,
                isPlaying: true,
            },
            options: [
                {
                    name: 'queue/song',
                    value: 'queue/song',
                    type: 3,
                    required: false,
                    description: 'Whether to loop the queue or current song.',
                },
            ],
            slashCommand: true,
        });
    }

    async run(client, message, args) {
        const player = client.music.players.get(message.guild.id);

        if (!args[0] || args[0].toLowerCase() == 'song') {
            if (!player.trackRepeat) {
                player.setTrackRepeat(true);
                return message.channel.send('Song is now being looped');
            }
            else {
                player.setTrackRepeat(false);
                return message.channel.send('Song has been unlooped');
            }
        }
        else if (args[0] == 'queue') {
            if (player.queueRepeat) {
                player.setQueueRepeat(false);
                return message.channel.send('Queue has been unlooped.');
            }
            else {
                player.setQueueRepeat(true);
                return message.channel.send('Queue is being looped.');
            }
        }
    }

    async execute(client, interaction, args) {
        const player = client.music.players.get(interaction.guild.id);

        if (!args[0].value || args[0].value.toLowerCase() == 'song') {
            if (!player.trackRepeat) {
                player.setTrackRepeat(true);
                return interaction.reply('Song is now being looped');
            }
            else {
                player.setTrackRepeat(false);
                return interaction.reply('Song has been unlooped');
            }
        }
        else if (args[0].value == 'queue') {
            if (player.queueRepeat) {
                player.setQueueRepeat(false);
                return interaction.reply('Queue has been unlooped.');
            }
            else {
                player.setQueueRepeat(true);
                return interaction.reply('Queue is being looped.');
            }
        }
    }
};