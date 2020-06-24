const Command = require('../../structures/Command');

const playlists = require('../../models/playlist.js');
const Discord = require('discord.js');

module.exports = class Save extends Command {
	constructor(client) {
		super(client, {
			name: 'save',
			description: 'Saves the queue to the user\'s playlist.',
			usage: '<playlist name>',
			args: true,
			aliases: ['savequeue', 'queuesave'],
            cooldown: 5,
            playing: true,
            permission: 'pro',
		});
	}
	async run(client, message, args) {
		const msg = await message.channel.send(`${client.emojiList.loading} Adding song(s) to your playlist (This might take a few seconds.)...`);
        if(args[0].length > 32) return msg.edit('Playlist title must be less than 32 characters!');
        const playlistName = args.join(' ').replace(/_/g, ' ');
        const player = client.music.players.get(message.guild.id);
		const songsToAdd = [];

        songsToAdd.push(player.current);
        songsToAdd[0].requester = message.author.id;
        for(let i = 0; i < player.queue.length; i++) {
            player.queue[i].requester = message.author.id;
            songsToAdd.push(player.queue[i]);
        }

        playlists.findOne({
            name: playlistName,
            creator: message.author.id,
        }, async (err, p) => {
            if (err) client.log(err);
            if (!p) {
                const newPlaylist = new playlists({
                    name: playlistName,
                    songs: [],
                    timeCreated: Date.now(),
                    thumbnail: 'none',
                    creator: message.author.id,
                });

                if(songsToAdd.length > 1) {
                    songsToAdd.length = await getSongsToAdd(newPlaylist.songs.length);
                }
                newPlaylist.songs = songsToAdd;
                newPlaylist.songs.length = clamp(newPlaylist.songs.length, 0, client.settings.playlistSongLimit);
                await newPlaylist.save().catch(e => console.log(e));

                const embed = new Discord.MessageEmbed()
                    .setAuthor(newPlaylist.name, message.author.displayAvatarURL())
                    .setDescription(`${client.emojiList.yes} Saved the current queue to playlist: **${newPlaylist.name}**.`)
                    .setFooter(`ID: ${newPlaylist._id} • ${newPlaylist.songs.length}/${client.settings.playlistSongLimit}`)
                    .setColor(client.colors.main)
                    .setTimestamp();
                msg.edit('', embed);
            }
            else {
                if(p.songs.length >= client.settings.playlistLimit) return msg.edit('You have reached the **maximum** amount of songs in the playlist');
                if(songsToAdd.length > 1) songsToAdd.length = await getSongsToAdd(p.songs.length);
                const currentPlaylist = p.songs;
                p.songs = currentPlaylist.concat(songsToAdd);
                p.songs.length = clamp(p.songs.length, 0, client.settings.playlistSongLimit);

                const embed = new Discord.MessageEmbed()
                    .setAuthor(p.name, message.author.displayAvatarURL())
                    .setDescription(`${client.emojiList.yes} Saved the queue to an existing playlist with the name: **${p.name}**.`)
                    .setFooter(`ID: ${p._id} • ${p.songs.length}/${client.settings.playlistSongLimit}`)
                    .setColor(client.colors.main)
                    .setTimestamp();
                msg.edit('', embed);
                await p.save().catch(e => client.log(e));
            }
        });

        async function getSongsToAdd(playlistLength) {
            let sTA = 0;
            const sL = await client.getSongLimit(message.author.id);
            if (playlistLength == 0) { sTA = Math.min(sL, songsToAdd.length); }
            else {
                const totalSongs = playlistLength + songsToAdd.length;
                if (totalSongs > sL) sTA = Math.min(sL - playlistLength, songsToAdd.length);
                else sTA = songsToAdd.length;
            }
            songsToAdd.length = sTA;
            return sTA;
        }
	}
};

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}