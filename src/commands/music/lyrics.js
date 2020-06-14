const Command = require('../../structures/Command');

const Discord = require('discord.js');
const { KSoftClient } = require('ksoft.js');
const isAbsoluteUrl = require('is-absolute-url');

const ksoft = new KSoftClient(process.env.KSOFT_TOKEN);

module.exports = class Lyrics extends Command {
	constructor(client) {
		super(client, {
			name: 'lyrics',
			description: 'Displays lyrics of a song.',
			usage: '<search query>',
			cooldown: 20,
		});
	}
	async run(client, message, args) {
		const msg = await message.channel.send(`${client.emojiList.loading} Fetching lyrics...`);

		let song = '';
		if (!args[0]) {
			const player = client.music.players.get(message.guild.id);
			if (!player) return message.channel.send('Please provide a song to search for lyrics or play a song.');
			else song = player.current.title;
		}
		else { song = args.join(' '); }

		if(isAbsoluteUrl(song)) return msg.edit('Please provide a song name. Links are not supported.');
		const data = await ksoft.lyrics.get(song, false)
			.catch(err => {
				return message.channel.send(err.message);
			});
		const embed = new Discord.MessageEmbed()
			.setTitle(`${data.name}`)
			.setAuthor(`${data.artist.name}`)
			.setDescription(data.lyrics.slice(0, 2044) + '...')
			.setColor(client.colors.main)
			.setFooter('Powered by KSoft.Si');
		msg.edit('', embed);
	}
};