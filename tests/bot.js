/* eslint-disable */
require('events').defaultMaxListeners = 20;
process.on('uncaughtException', (e) => {
    console.error(e.stack);
});

process.on('unhandledRejection', (e) => {
    console.error(e.stack);
});

const { TrackPlayer, VoiceConnection, Source } = require('yasha');

const Discord = require('discord.js');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES] });

const config = require('./config.json');

client.on('ready', () => {
    console.log('Ready!');
});

var player = new TrackPlayer({
    external_encrypt: true
});

var gtrack, players = 0, packets = 0;
var last_packets = 0, playerz = [];
var delay_low = 10000, delay_high = 0;
var pp = 0, last_p = 0;
var ticksss = 0;

// var interval = setInterval(() => {
//     console.log(packets - last_packets, 'packets/sec', (packets - last_packets) / 50, 'players', players, 'delay', delay_low, delay_high, 'p', pp - last_p, 'ticks', ticksss);

//     last_packets = packets;
//     delay_high = 0;
//     delay_low = 10000;
//     last_p = pp;
//     ticksss = 0;
// }, 1000);

var last_tick = 0;
setInterval(() => {
    var now = Date.now();
    var diff = now - last_tick;
    last_tick = now;

    if (diff > 2)
        ticksss += diff;
});

client.on('messageCreate', async (message) => {
    if (message.channel.id != '689277002988912661') return;
    if (!message.content.startsWith(config.prefix))
        return;
    var start = Date.now();
    const args = message.content.substring(config.prefix.length).split(/[ ]+/g);

    // if (args[0] === 'enable' && message.author.id == '275831434772742144') {
    //     client.shard.broadcastEval(c => c.sendMessage = true);
    // } else if (client.sendMessage) {
    //     console.log(`${args[0]} command received from ${message.author.id}:${message.guild.id}`);
    //     return message.channel.send('Ear Tensifier is currently being upgraded to version 2.0.0. Please be patient while we update the bot. Estimated time: 10 - 30 minutes.');
    // }

    if (args[0] == 'play') {
        const title = args.slice(1).join(' ');

        var connection = await VoiceConnection.connect(message.member.voice.channel);
        var track = await Source.resolve(title);

        if (!track) {
            var results = await Source.Youtube.search(title);
            var track = await results[0];
        }

        gtrack = track;

        var utime = Date.now();

        if (!player.subscriptions.length)
            connection.subscribe(player);
        track.streams = await track.getStreams();

        player.play(track);
        player.start();

        player.on('ready', () => {
            console.log('Time to ready: ' + (Date.now() - utime) + 'ms');
        });

        player.once('packet', () => {
            console.log('Time to first packet: ', 'Total = ' + (Date.now() - start) + 'ms', 'FFmpeg = ' + (Date.now() - utime) + 'ms');
        });

        var last_packet = 0;
        player.on('packet', () => {
            var now = Date.now();

            if (now - last_packet > delay_high)
                delay_high = now - last_packet;
            else if (now - last_packet < delay_low)
                delay_low = now - last_packet;
            last_packet = now;
            packets++;
        });

        player.on('finish', () => {
            console.log('finish');
        });

        player.on('error', (e) => {
            console.log(e);
        });
    } else if (args[0] == 'seek') {
        player.seek(parseFloat(args[1]));
    } else if (args[0] == 'volume') {
        player.setVolume(parseFloat(args[1]));
    } else if (args[0] == 'rate') {
        player.setRate(parseFloat(args[1]));
    } else if (args[0] == 'tempo') {
        player.setTempo(parseFloat(args[1]));
    } else if (args[0] == 'bitrate') {
        player.setBitrate(parseInt(args[1]));
    } else if (args[0] == 'time') {
        message.channel.send(player.getTime() + '');
    } else if (args[0] == 'bench') {
        var secretKey = player.subscriptions[0].connection.state.networking.state.connectionData.secretKey;
        var udp = player.subscriptions[0].connection.state.networking.state.udp;

        for (var i = 0; i < parseInt(args[1]); i++) {
            await new Promise((resolve) => {
                let p = new TrackPlayer({
                    external_encrypt: true,
                    external_packet_send: true
                });

                playerz.push(p);

                p.play(gtrack);
                p.start();
                p.subscribe({
                    state: {
                        networking: {
                            state: {
                                connectionData: {
                                    encryptionMode: 'xsalsa20_poly1305_lite',
                                    sequence: 0,
                                    timestamp: 0,
                                    ssrc: 0,
                                    nonce: 0,
                                    secretKey
                                },

                                udp
                            }
                        }
                    },

                    on: () => { },
                    removeListener: () => { },

                    ready: () => true,
                    setSpeaking: () => { },
                    a: 1,

                    onSubscriptionRemoved: () => { }
                });

                // p.once('ready', resolve);
                resolve();

                p.once('packet', () => {
                    // p.setVolume(2);
                    // p.setRate(2);
                    console.log('Player benching', ++players);
                });

                // p.on('packet', () => {
                //     // packets++;
                //     pp++;
                // });

                p.once('finish', () => {
                    console.log(--players);
                });

                p.once('error', (e) => {
                    console.log(e, --players);
                });
            });
        }

    } else if (args[0] == 'dur') {
        message.channel.send(player.getDuration() + '');
    } else if (args[0] == 'frame') {
        message.channel.send(player.getTotalFrames() + '');
    } else if (args[0] == 'drop') {
        message.channel.send(player.getFramesDropped() + '');
    }
});

client.login(config.token);