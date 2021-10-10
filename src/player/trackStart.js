/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const users = require('../models/user.js');
const songs = require('../models/song.js');
const bot = require('../models/bot.js');

module.exports = async (client, player, track) => {
	player.futurePrevious = player.queue.current;
	let requester = `<@${track.requester.id}>`;
	if (!track.requester.id) requester = `<@${track.requester}>`;

	const thumbnail = `https://img.youtube.com/vi/${track.identifier}/default.jpg`;
	const id = track.uri;
	const title = track.title;
	const author = track.author;
	const duration = track.duration;
	addDB(id, title, author, duration, thumbnail);

	bot.findOne({
		clientID: client.user.id,
	}, async (err, b) => {
		if (err) client.log(err);
		b.songsPlayed += 1;
		await b.save().catch(e => client.log(e));
	});

	users.findOne({ authorID: (!track.requester.id ? track.requester : track.requester.id) }).then(async messageUser => {
		if (!messageUser) {
			console.log('not found');
			const newUser = new users({
				authorID: track.requester.id,
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
	if (id.includes('soundcloud')) {
		embed.attachFiles(['./assets/soundcloud.png']);
		embed.setThumbnail('attachment://soundcloud.png');
		embed.setFooter('SoundCloud');
		embed.setColor(client.colors.soundcloud);
	}
	else if (id.includes('bandcamp')) {
		embed.attachFiles(['./assets/bandcamp.png']);
		embed.setThumbnail('attachment://bandcamp.png');
		embed.setFooter('bandcamp');
		embed.setColor(client.colors.bandcamp);
	}
	// mixer
	else if (id.includes('beam.pro')) {
		embed.attachFiles(['./assets/mixer.png']);
		embed.setThumbnail('attachment://mixer.png');
		embed.setFooter('Mixer');
		embed.setColor(client.colors.mixer);
	}
	else if (id.includes('twitch')) {
		embed.attachFiles(['./assets/twitch.png']);
		embed.setThumbnail('attachment://twitch.png');
		embed.setFooter('Twitch');
		embed.setColor(client.colors.twitch);
	}
	else if (id.includes('youtube')) {
		embed.setThumbnail(thumbnail);
		embed.setFooter('Youtube');
		embed.setColor(client.colors.youtube);
	}
	else {
		embed.setColor(client.colors.main);
		embed.setFooter('Other');
	}

	const parsedDuration = client.formatDuration(duration);

	embed.addField('Author', author, true);
	embed.setDescription(`**[${title}](${id})** [${parsedDuration}]`);
	embed.addField('Requested by', requester, true);
	// embed.addField(`Duration \`${parsedCurrentDuration}/${parsedDuration}\``, `\`\`\`${uni} ${'─'.repeat(part) + '⚪' + '─'.repeat(client.settings.embedDurationLength - part)}\`\`\``);
	embed.setTimestamp();

	return player.get("textChannel").send(embed);
};

function addDB(id, title, author, duration, thumbnail) {
	let songType = '';
	if (id.includes('youtube')) songType = 'youtube';
	else if (id.includes('soundcloud')) songType = 'soundcloud';
	else if (id.includes('bandcamp')) songType = 'bandcamp';
	else if (id.includes('mixer')) songType = 'mixer';
	else if (id.includes('twitch')) songType = 'twitch';
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