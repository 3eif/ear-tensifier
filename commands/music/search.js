/* eslint-disable no-case-declarations */
const Discord = require('discord.js');
const { Utils } = require('erela.js');

module.exports = {
	name: 'search',
	description: 'Provides a variety of search results for a song.',
	usage: '<search query>',
	args: true,
	sameVoiceChannel: true,
	async execute(client, message, args) {
		if(!args[0]) return message.channel.send('Please provide a search query.');
		if (!message.member.voice.channel) return client.responses('noVoiceChannel', message);

		const permissions = message.member.voice.channel.permissionsFor(client.user);
		if(!permissions.has('CONNECT')) return client.responses('noPermissionConnect', message);
		if(!permissions.has('SPEAK')) return client.responses('noPermissionSpeak', message);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		const player = client.music.players.spawn({
			guild: message.guild,
			textChannel: message.channel,
			voiceChannel: message.member.voice.channel,
		});

		client.music.search(args.join(' '), message.author).then(async res => {
			switch(res.loadType) {
			case 'TRACK_LOADED' :
				player.queue.add(res.tracks[0]);
				msg.edit(`**${res.tracks[0].title}** (${Utils.formatTime(res.tracks[0].duration, true)}) has been added to the queue by **${res.playlist.tracks.requester}**`);
				if(!player.playing) player.play();
				break;
			case 'SEARCH_RESULT' :
				let index = 1;
				const tracks = res.tracks.slice(0, 9);
				const embed = new Discord.MessageEmbed()
					.setAuthor('Song Selection.', message.author.displayAvatarURL())
					.setDescription(tracks.map(video => `**${index++} -** ${video.title}`))
					.setFooter('Your response time closes within the next 30 seconds. Type \'cancel\' to cancel the selection')
					.setColor(client.colors.main);
				await msg.edit('', embed);

				const collector = message.channel.createMessageCollector(m => {
					return m.author.id === message.author.id && new RegExp('^([1-9]|cancel)$', 'i').test(m.content);
				}, { time: 30000, max: 1 });

				collector.on('collect', m => {
					if (/cancel/i.test(m.content)) return collector.stop('cancelled');

					const track = tracks[Number(m.content) - 1];
					player.queue.add(track);
					message.channel.send(`**${track.title}** (${Utils.formatTime(track.duration, true)}) has been added to the queue by **${track.requester.tag}**`);
					if(!player.playing) player.play();
				});

				collector.on('end', (_, reason) => {
					if(['time', 'cancelled'].includes(reason)) return message.channel.send('Cancelled selection.');
				});
				break;

			case 'PLAYLIST_LOADED' :
				// res.playlist.tracks.forEach(track => player.queue.add(track));
				// const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cure) => ({duration: acc.duration + cure.duration})).duration, true);
				// msg.edit(`**${res.playlist.info.name}** (${duration}) (${res.playlist.tracks.length} tracks) has been added to the queue by **${res.tracks[0].requester.tag}**`);
				// if(!player.playing) player.play()
				return message.channel.send('Playlist functionality is currently disabled. Please try again later.');
			}
		}).catch(err => msg.edit(err.message));
	},
};