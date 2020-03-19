const { Utils } = require('erela.js');
const Discord = require('discord.js');
const bot = require('../models/bot.js');
const users = require('../models/user.js');
const songs = require('../models/song.js');

module.exports = async (client, textChannel, title, duration, author, uri) => {
	const currentSong = client.music.players.get(textChannel.guild.id).queue[0];
	const requester = currentSong.requester.username + '#' + currentSong.requester.discriminator;
	const thumbnail = `https://img.youtube.com/vi/${currentSong.identifier}/default.jpg`;
	addDB(uri, title, author, duration, uri, thumbnail);

	bot.findOne({
		clientID: client.user.id,
	}, async (err, b) => {
		if (err) console.log(err);

		b.songsPlayed += 1;
		await b.save().catch(e => console.log(e));
	});

	users.findOne({
		authorID: requester.id,
	}, async (err, u) => {
		if (err) console.log(err);

		u.songsPlayed += 1;
		await u.save().catch(e => console.log(e));
	});

	const embed = new Discord.MessageEmbed()
		.setTitle(author);
	if (uri.includes('soundcloud')) {
		embed.attachFiles(['./assets/soundcloud.PNG']);
		embed.setThumbnail('attachment://soundcloud.PNG');
		embed.setFooter('SoundCloud');
		embed.setColor(client.colors.soundcloud);
	}
	else if (uri.includes('bandcamp')) {
		embed.attachFiles(['./assets/bandcamp.PNG']);
		embed.setThumbnail('attachment://bandcamp.PNG');
		embed.setFooter('bandcamp');
		embed.setColor(client.colors.bandcamp);
	}
	else if (uri.includes('mixer')) {
		embed.attachFiles(['./assets/mixer.PNG']);
		embed.setThumbnail('attachment://mixer.PNG');
		embed.setFooter('Mixer');
		embed.setColor(client.colors.mixer);
	}
	else if (uri.includes('twitch')) {
		embed.attachFiles(['./assets/twitch.PNG']);
		embed.setThumbnail('attachment://twitch.PNG');
		embed.setFooter('Twitch');
		embed.setColor(client.colors.twitch);
	}
	else if (uri.includes('youtube')) {
		embed.setThumbnail(thumbnail);
		embed.setFooter('Youtube');
		embed.setColor(client.colors.youtube);
	}
	else {
		embed.setColor(client.colors.main);
		embed.setFooter('Other');
	}

	embed.setDescription(`[${title}](${uri})`);
	embed.addField('Duration', `${Utils.formatTime(duration, true)}`, true);
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