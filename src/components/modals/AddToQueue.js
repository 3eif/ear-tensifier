const Modal = require('../../structures/Modal');
const { TrackPlaylist } = require('yasha/src/Track');
const QueueHelper = require('../../helpers/QueueHelper');

module.exports = class AddToQueue extends Modal {
    constructor(client) {
        super(client, {
            id: 'ADD_TO_QUEUE_MODAL',
        });
    }
    async run(client, interaction) {
        const query = interaction.fields.getTextInputValue('songToAdd');

        let player = client.music.players.get(interaction.guild.id);
        if (!player) {
            player = await client.music.newPlayer(interaction.guild, interaction.member.voice.channel, interaction.channel);
            player.connect();
        }

        if (player.queue.length > client.config.max.songsInQueue) return interaction.reply({ content: `You have reached the **maximum** amount of songs (${client.config.max.songsInQueue})` });

        let result;
        try {
            result = await client.music.search(query, interaction.user);
        }
        catch (error) {
            return await interaction.reply({ content: 'No results found.' });
        }

        if (result instanceof TrackPlaylist) {
            let res = result;
            const firstTrack = res.first_track;
            let list = [];

            if (firstTrack) list.push(firstTrack);

            while (res && res.length) {
                if (firstTrack) {
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].equals(firstTrack)) {
                            res.splice(i, 1);
                            break;
                        }
                    }
                }
                list = list.concat(res);
                try {
                    res = await res.next();
                }
                catch (e) {
                    client.logger.error(e);
                    throw e;
                }
            }

            if (list.length) {
                for (const track of list) {
                    if (!track.requester) track.requester = interaction.user;
                    player.queue.add(track);
                }
            }

            const totalDuration = list.reduce((acc, cur) => acc + cur.duration, 0);

            if (!player.playing && !player.paused) player.play();
            return await interaction.reply({ content: null, embeds: [QueueHelper.queuedEmbed(result.title, result.url, totalDuration, list.length, interaction.user, client.config.colors.default)] });
        }

        // console.log(result);
        // if (result.streams.isLive) return ctx.editMessage(client.config.emojis.failure + ' Live stream playback is currently not supported.');

        player.queue.add(result);
        if (!player.playing && !player.paused) player.play();

        await interaction.reply({ content: null, embeds: [QueueHelper.queuedEmbed(result.title, result.url, result.duration, null, interaction.user, client.config.colors.default)] });

    }
};