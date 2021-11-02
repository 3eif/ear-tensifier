const { VoiceConnection } = require('yasha');
const Player = require('../../structures/Player');
const Command = require('../../structures/Command');

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
            options: [
                {
                    name: 'query',
                    value: 'query',
                    type: 3,
                    required: true,
                    description: 'play command',
                },
            ],
        });
    }

    async run(client, message, args) {
        const query = args.slice(0).join(' ');

        let player = client.music.players.get(message.guild.id);
        if (!player) player = new Player({
            manager: client.music,
            guild: message.guild,
            voiceChannel: message.member.voice.channel,
            textChannel: message.channel,
        });

        const connection = await VoiceConnection.connect(message.member.voice.channel);
        connection.subscribe(player);

        const track = await client.music.search(query);

        player.queue.add(track);
        if (!player.playing) player.play();

        message.channel.send(`Added **${track.title}** to the queue!`);
    }

    async execute(client, interaction, args) {
        const query = args[0].value;

        let player = client.music.players.get(interaction.guild.id);
        if (!player) {
            player = new Player({
                manager: client.music,
                guild: interaction.guild,
                voiceChannel: interaction.member.voice.channel,
                textChannel: interaction.channel,
            });
        }

        const connection = await VoiceConnection.connect(interaction.member.voice.channel);
        connection.subscribe(player);

        const track = await client.music.search(query);

        player.queue.add(track);
        if (!player.playing) player.play();

        await interaction.reply(`Added **${track.title}** to the queue!`);
    }
};
