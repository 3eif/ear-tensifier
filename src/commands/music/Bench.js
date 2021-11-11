const Command = require('../../structures/Command');
const { TrackPlayer, Source } = require('yasha');

module.exports = class Bench extends Command {
    constructor(client) {
        super(client, {
            name: 'bench',
            description: {
                content: 'Benchmarks the bot.',
            },
            args: false,
            slashCommand: false,
        });
    }

    async run(client, ctx, args) {
        const results = await Source.Youtube.search('resonance');
        const track = await results[0];

        let packets = 0, last_packets = 0;

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

            p.on('packet', () => { packets++; });
        }

        setInterval(() => {
            console.log(packets - last_packets, 'packets/sec');
            last_packets = packets;
        }, 1000);

        return ctx.sendMessage('Benching...');
    }
};
