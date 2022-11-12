const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const Command = require('../../structures/Command');
const Playlist = require('../../models/Playlist');

module.exports = class Save extends Command {
    constructor(client) {
        super(client, {
            name: 'save',
            description: {
                content: 'Saves the queue to a playlist.',
                usage: '<playlist name>',
                examples: ['Random_Access_Memories'],
            },
            args: true,
            aliases: ['savequeue', 'queuesave'],
            voiceRequirements: {
                isPlaying: true,
                inVoiceChannel: true,
            },
            options: [
                {
                    name: 'playlist',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: 'The playlist\'s name.',
                    max_value: 100,
                    autocomplete: true,
                },
            ],
            slashCommand: false,
            enabled: false,
        });
    }
    async run(client, ctx, args) {
        await ctx.sendDeferMessage(`${client.config.emojis.typing} Adding song(s) to your playlist (This might take a few seconds.)...`);

        if (args[0].length > this.options[0].max_value) return ctx.editMessage(`Playlist title must be less than ${this.options[0].max_value} characters!`);
        const playlistName = args.join(' ').replace(/_/g, ' ');
        const player = client.music.players.get(ctx.guild.id);
        const tracksToAdd = [];

        tracksToAdd.push(player.queue.current);
        for (let i = 0; i < player.queue.length; i++) {
            tracksToAdd.push(player.queue[i]);
        }

        for (let i = 0; i < tracksToAdd.length; i++) {
            tracksToAdd[i] = {
                _id: tracksToAdd[i].id,
                title: tracksToAdd[i].title,
                url: tracksToAdd[i].url,
                author: tracksToAdd[i].author,
                duration: tracksToAdd[i].duration,
                thumbnail: tracksToAdd[i].thumbnail,
                platform: tracksToAdd[i].platform,
                playable: tracksToAdd[i].playable,
            };
        }

        Playlist.findOne({
            name: playlistName,
            creator: ctx.author.id,
        }, async (err, p) => {
            if (err) client.log(err);
            if (!p) {
                const newPlaylist = new Playlist({
                    name: playlistName,
                    tracks: [],
                    createdTimestamp: Date.now(),
                    creator: ctx.author.id,
                });

                newPlaylist.tracks = tracksToAdd;
                newPlaylist.tracks.length = clamp(newPlaylist.tracks.length, 0, client.config.max.songsInPlaylist);
                await newPlaylist.save().catch(e => client.logger.error(e));

                const embed = new EmbedBuilder()
                    .setAuthor({ name: newPlaylist.name, iconURL: ctx.author.displayAvatarURL() })
                    .setDescription(`${client.config.emojis.success} Saved the current queue to playlist: **${newPlaylist.name}**.`)
                    .setFooter({ text: `ID: ${newPlaylist._id} • ${newPlaylist.tracks.length}/${client.config.max.songsInPlaylist}` })
                    .setColor(client.config.colors.default)
                    .setTimestamp();
                ctx.editMessage({ content: null, embeds: [embed] });
            }
            else {
                if (p.tracks.length >= client.config.max.playlists) return ctx.editMessage(`${client.config.emojis.failure} You have reached the **maximum** amount of songs in the playlist`);

                const currentPlaylist = p.tracks;
                p.tracks = currentPlaylist.concat(tracksToAdd);
                p.tracks.length = clamp(p.tracks.length, 0, client.config.max.songsInPlaylist);
                await p.updateOne({ tracks: p.tracks }).catch(e => client.logger.error(e));

                const embed = new EmbedBuilder()
                    .setAuthor({ name: p.name, iconURL: ctx.author.displayAvatarURL() })
                    .setDescription(`${client.config.emojis.success} Saved the queue to an existing playlist with the name: **${p.name}**.`)
                    .setFooter({ text: `ID: ${p._id} • ${p.tracks.length}/${client.config.max.songsInPlaylist}}` })
                    .setColor(client.config.colors.default)
                    .setTimestamp();
                ctx.editMessage({ content: null, embeds: [embed] });
            }
        });
    }
};

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}