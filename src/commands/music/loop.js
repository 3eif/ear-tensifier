const Command = require('../../structures/Command');

module.exports = class Loop extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            description: 'Repeats the current queue/song',
            aliases: ['repeat', 'unloop'],
            usage: '<queue/song>',
            cooldown: '4',
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: true,
        });
    }

    async run(client, message, args) {
        const player = client.music.players.get(message.guild.id);

        if (!args[0] || args[0].toLowerCase() === 'song') {
            player.queue.loop('song');
            if (!player.queue.repeat.song)
                return message.channel.send('Song is now being looped');
            else return message.channel.send('Song has been unlooped');
        }
        else if (args[0] === 'queue') {
            player.queue.loop('queue');
            if (!player.queue.repeat.queue)
                return message.channel.send('Queue has been unlooped.');
            else return message.channel.send('Queue is being looped.');
        }
    }
};