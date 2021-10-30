const { Source, VoiceConnection, TrackPlayer, Track } = require('node-ffplayer');
const Player = require('../../structures/Player');
const Command = require('../../structures/Command');
const Manager = require('../../structures/Manager');

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: {
                content: 'Ping command',
            },
            enabled: true,
            cooldown: 4,
            args: false,
            options: {},
        });
    }

    async run(client, message, args) {
        const contents = args.slice(0).join(' ');

        console.log(new TrackPlayer());

        let player = client.music.players.get(message.guild.id);
        if (!player) player = new Player({
            client: client,
            guildId: message.guild.id,
            voiceChannelId: message.member.voice.channel.id,
            textChannelId: message.channel.id,
        });

        console.log(player);

        const connection = await VoiceConnection.connect(message.member.voice.channel);
        connection.subscribe(player);

        let track = await Source.resolve(contents);

        if (!track) {
            const results = await Source.Youtube.search(contents);
            track = await results[0];
        }

        player.play(track);
        player.start();

        player.on('error', (e) => {
            console.log(e);
            player.destroy();
        });

        message.channel.send(`Now playing **${track.title}**!`);
    }

    async execute(client, interaction) {
        await interaction.reply('Pong!');
    }
};
