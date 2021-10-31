const { Source, VoiceConnection, TrackPlayer, Track } = require('yasha');
const Player = require('../../structures/Player');
const Command = require('../../structures/Command');
const Manager = require('../../structures/Manager');

module.exports = class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            description: {
                content: 'play command',
            },
            enabled: true,
            cooldown: 4,
            args: false,
            options: {},
        });
    }

    async run(client, message, args) {
        const contents = args.slice(0).join(' ');

        let player = client.music.players.get(message.guild.id);
        if (!player) player = new Player({
            manager: client.music,
            guild: message.guild,
            voiceChannel: message.member.voice.channel,
            textChannel: message.channel,
        });

        const connection = await VoiceConnection.connect(message.member.voice.channel);
        connection.subscribe(player);

        let track = await Source.resolve(contents);

        if (!track) {
            const results = await Source.Youtube.search(contents);
            track = await results[0];
        }

        player.queue.add(track);
        if (!player.playing) player.play(track);

        message.channel.send(`Added **${track.title}** to the queue!`);
    }

    async execute(client, interaction) {
        await interaction.reply('Pong!');
    }
};
