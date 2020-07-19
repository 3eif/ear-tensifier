/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const users = require('../models/user.js');
const songs = require('../models/song.js');
const bot = require('../models/bot.js');

module.exports = async (client, textChannel, title, duration, author, uri) => {
	const currentSong = client.music.players.get(textChannel.guild.id).current;
	const player = client.music.players.get(textChannel.guild.id);
	player.futurePrevious = player.current;
	let requester = `<@${currentSong.requester.id}>`;
	if(!currentSong.requester.id) requester = `<@${currentSong.requester}>`;
	const thumbnail = `https://img.youtube.com/vi/${currentSong.identifier}/default.jpg`;
	addDB(uri, title, author, duration, uri, thumbnail);

	bot.findOne({
		clientID: client.user.id,
	}, async (err, b) => {
		if (err) client.log(err);
		b.songsPlayed += 1;
		await b.save().catch(e => client.log(e));
	});

	users.findOne({ authorID: (!currentSong.requester.id ? currentSong.requester : currentSong.requester.id) }).then(async messageUser => {
		if (!messageUser) {
			console.log('not found');
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
			messageUser.songsPlayed++;
			await messageUser.save().catch(e => this.client.log(e));
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
		embed.setThumbnail(thumbnail);
		embed.setFooter('Youtube');
		embed.setColor(client.colors.youtube);
	}
	else {
		embed.setColor(client.colors.main);
		embed.setFooter('Other');
	}

	const currentDuration = client.music.players.get(textChannel.guild.id).position;
	const playing = client.music.players.get(textChannel.guild.id).playing;
	const parsedCurrentDuration = client.formatDuration(currentDuration);
	const parsedDuration = client.formatDuration(duration);
	const part = Math.floor((currentDuration / duration) * client.settings.embedDurationLength);
	const uni = playing ? '▶' : '⏸️';

	embed.addField('Author', author, true);
	embed.setDescription(`**[${title}](${uri})** [${parsedDuration}]`);
	embed.addField('Requested by', requester, true);
	// embed.addField(`Duration \`${parsedCurrentDuration}/${parsedDuration}\``, `\`\`\`${uni} ${'─'.repeat(part) + '⚪' + '─'.repeat(client.settings.embedDurationLength - part)}\`\`\``);
	embed.setTimestamp();

	return textChannel.send(embed);
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