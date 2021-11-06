const Command = require('../../structures/Command');
const { TrackPlayer, Source } = require('yasha');

module.exports = class Bench extends Command {
    constructor(client) {
        super(client, {
            name: 'bench',
            description: {
                content: 'bench command',
            },
            enabled: true,
            cooldown: 4,
            args: false,
        });
    }

    async run(client, message, args) {
        const results = await Source.Youtube.search('resonance');
        const track = await results[0];

        let players = 0;
        for (let i = 0; i < args[0]; i++) {
            const p = new TrackPlayer();

            p.play(track);
            p.start();

            p.once('packet', () => {
                console.log('Player benching', ++players);
            });

            p.once('finish', () => {
                console.log(--players);
            });

            p.once('error', (e) => {
                console.log(e, --players);
            });
        }

        let packets = 0, last_packets = 0;

        setInterval(() => {
            console.log(packets - last_packets, 'packets/sec');
            last_packets = packets;
        }, 1000);

        p.on('packet', () => { packets++; });

        return message.channel.send('Benching...');
    }

    async execute(client, interaction) {
        const player = client.music.players.get(interaction.guild.id);
        this.skip(player);
        await interaction.reply('Skipped...');
    }
};
