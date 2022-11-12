const { ApplicationCommandOptionType } = require('discord.js');
const Command = require('../../structures/Command');
const genius = require("genius-lyrics");
const Genius = new genius.Client(process.env.GENIUS_API);
const _ = require('lodash');
const { EmbedBuilder } = require('discord.js');

module.exports = class Lyrics extends Command {
    constructor(client) {
        super(client, {
            name: 'lyrics',
            description: {
                content: 'Search lyrics of the song.',
                usage: '<query>',
            },
            args: false,
            voiceRequirements: {
                isInVoiceChannel: false,
                isInSameVoiceChannel: false,
                isPlaying: false,
            },
            options: [{
                name: 'song',
                type: ApplicationCommandOptionType.String,
                required: false,
                description: 'Song name to find lyrics for.',
            }],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);
        if (!args[0] && !player) return ctx.sendEphemeralMessage('There is nothing currently playing.');
        let query = args.join(' ');
        if (!args[0]) query = player.queue.current.title;
        const getSongTitle = query.replace(
            /lyrics|lyric|lyrical|official music video|\(official music video\)|\(Official Video\)|audio|\(audio\)|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|(\[.+\])/gi,
            '',
        );

        let songs = (await Genius.songs.search(getSongTitle))[0];
        const songTitle = songs.title || song.featuredTitle;
        const songLyrics = await songs.lyrics();
        if (!songLyrics) return ctx.sendEphemeralMessage(`**No lyrics found for **${songTitle}**`);
        const lyrics = songLyrics.split('\n');
        const formattedLyrics = _.chunk(lyrics, 40);

        let pages = formattedLyrics.map((ly) => {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Lyrics for ${songTitle}`, iconURL: client.user.displayAvatarURL() })
                .setDescription(ly.join('\n'))
                .setThumbnail(songs.thumbnail);
            return embed;
        });

        return ctx.messageHelper.paginate(pages);
    }
};
