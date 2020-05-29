const Discord = require('discord.js');
const users = require('../models/user.js');
const quickdb = require('quick.db');
const songs = require('../models/song.js');
const yts = require('yt-search');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);

module.exports = async (client, textChannel, title, duration, author, uri) => {
	const currentSong = client.music.players.get(textChannel.guild.id).queue[0];
	const requester = `<@${currentSong.requester.id}>`;
	const thumbnail = `https://img.youtube.com/vi/${currentSong.identifier}/maxresdefault.jpg`;
	addDB(uri, title, author, duration, uri, thumbnail);

	// bot.findOne({
	// 	clientID: client.user.id,
	// }, async (err, b) => {
	// 	if (err) client.log(err);

	// 	b.songsPlayed += 1;
	// 	await b.save().catch(e => client.log(e));
	// });

	quickdb.add(`songsPlayed.${client.user.id}`, 1);

	users.findOne({ authorID: requester.id }).then(async messageUser => {
		if (!messageUser) {
			const newUser = new users({
				authorID: requester.id,
				bio: '',
				songsPlayed: 1,
				commandsUsed: 0,
				blocked: false,
				premium: false,
				pro: false,
				developer: false,
			});
			await newUser.save().catch(e => this.client.log(e));
		}
		else {
			messageUser.songsPlayed += 1;
			await messageUser.save().catch(e => console.error(e));
		}
	});

	const embed = new Discord.MessageEmbed()
		.setAuthor('Now Playing', 'https://cdn.discordapp.com/emojis/673357192203599904.gif?v=1');
	if (uri.includes('soundcloud')) {
		embed.attachFiles(['./assets/soundcloud.png']);
		embed.setThumbnail('attachment://soundcloud.png');
		embed.setFooter('SoundCloud');
		embed.setColor(client.colors.soundcloud);
	}
	else if (uri.includes('bandcamp')) {
		embed.attachFiles(['./assets/bandcamp.png']);
		embed.setThumbnail('attachment://bandcamp.png');
		embed.setFooter('bandcamp');
		embed.setColor(client.colors.bandcamp);
	}
	// mixer
	else if (uri.includes('beam.pro')) {
		embed.attachFiles(['./assets/mixer.png']);
		embed.setThumbnail('attachment://mixer.png');
		embed.setFooter('Mixer');
		embed.setColor(client.colors.mixer);
	}
	else if (uri.includes('twitch')) {
		embed.attachFiles(['./assets/twitch.png']);
		embed.setThumbnail('attachment://twitch.png');
		embed.setFooter('Twitch');
		embed.setColor(client.colors.twitch);
	}
	else if (uri.includes('youtube')) {

		const opts = { videoId: currentSong.identifier };

		// eslint-disable-next-line no-unused-vars
		yts(opts, function(err, video) {
			embed.setThumbnail(thumbnail);
			embed.setFooter('Youtube');
			embed.setColor(client.colors.youtube);

			const parsedDuration = moment.duration(duration, 'milliseconds').format('hh:mm:ss', { trim: false });
			embed.setDescription(`**[${title}](${uri})** \`[${parsedDuration}]\``);
			embed.addField('Author', `${author}`, true);
			embed.addField('Requested by', requester, true);

			// const parsedDuration = moment.duration(duration, 'milliseconds').format('hh:mm:ss', { trim: false });
			// const part = Math.floor((0 / duration) * 30);
			// const uni = '▶';
			// embed.addField(`Duration \`[${parsedDuration}]\``, `\`\`\`${uni} ${'─'.repeat(part) + '⚪' + '─'.repeat(30 - part)}\`\`\``);

			embed.setTimestamp();

			return textChannel.send(embed);
		});
	}
	else {
		embed.setColor(client.colors.main);
		embed.setFooter('Other');
	}

	if (uri.includes('youtube')) return;

	embed.addField('Author', `${author}`, true);

	const parsedDuration = moment.duration(duration, 'milliseconds').format('hh:mm:ss', { trim: false });
	embed.setDescription(`**[${title}](${uri})** \`[${parsedDuration}]\``);
	embed.addField('Requested by', requester, true);
	embed.setTimestamp();
	textChannel.send(embed);
};

function addDB(id, title, author, duration, url, thumbnail) {
	let songType = '';
	if (url.includes('youtube')) songType = 'youtube';
	else if (url.includes('soundcloud')) songType = 'soundcloud';
	else if (url.includes('bandcamp')) songType = 'bandcamp';
	else if (url.includes('mixer')) songType = 'mixer';
	else if (url.includes('twitch')) songType = 'twitch';
	else songType = 'other';

	songs.findOne({
		songID: id,
	}, async (err, s) => {
		if (err) console.log(err);
		if (!s) {
			const newSong = new songs({
				songID: id,
				songName: title,
				songAuthor: author,
				type: songType,
				songDuration: duration,
				timesPlayed: 1,
				timesAdded: 0,
				songThumbnail: thumbnail,
			});
			await newSong.save().catch(e => console.log(e));
		}
		else {
			s.timesPlayed += 1;
			await s.save().catch(e => console.log(e));
		}
	});
}