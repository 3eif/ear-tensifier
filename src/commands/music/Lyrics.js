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
                description: 'Enter song name or current song playing.',
            }],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        const player = client.music.players.get(ctx.guild.id);
        let SongTitle = args.join(' ');
        if (!args[0] && !player) return ctx.sendMessage('❌ | Nothing is playing right now...');
        if (!args[0]) SongTitle = player.queue.current.title;
        const FindSongTitle = SongTitle.replace(
            /lyrics|lyric|lyrical|official music video|\(official music video\)|\(Official Video\)|audio|\(audio\)|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|(\[.+\])/gi,
            '',
        );

        let songs = (await Genius.songs.search(FindSongTitle))[0]
        const songs_lyrics = await songs.lyrics()
        if (!songs_lyrics) return ctx.sendMessage(`**No lyrics found for -** \`${SongTitle}\``);
        const lyrics = songs_lyrics.split('\n'); // spliting into lines
        const SplitedLyrics = _.chunk(lyrics, 40); // 45 lines each page

        let Pages = SplitedLyrics.map((ly) => {
                const em = new EmbedBuilder()
                    .setAuthor({
                        name: `Lyrics for: ${SongTitle}`,
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setColor('#292B2F')
                    .setDescription(ly.join('\n'));

                if (args.join(' ') !== SongTitle)
                    em.setThumbnail(player.queue.current.thumbnail);
      
            return em;
        });


        return ctx.messageHelper.paginate(Pages);

    }
};
