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
            permissions: {
                dev: true,
            },
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
                client.logger.debug('Player benching', ++players);
            });

            p.once('finish', () => {
                client.logger.debug(--players);
            });

            p.once('error', (e) => {
                client.logger.debug(e, --players);
            });

            p.on('packet', () => { packets++; });
        }

        setInterval(() => {
            client.logger.debug(packets - last_packets, 'packets/sec');
            last_packets = packets;
        }, 1000);

        return ctx.sendMessage('Benching...');
    }
};