const Discord = require('discord.js');
const { KSoftClient } = require('ksoft.js');

const { ksoftToken } = require('../../tokens.json');
const ksoft = new KSoftClient(ksoftToken);

module.exports = {
	name: 'lyrics',
	description: 'Displays lyrics of a song.',
	usage: '<search query>',
	cooldown: 20,
	async execute(client, message, args) {
		const msg = await message.channel.send(`${client.emojiList.loading} Fetching lyrics...`);

		let song = '';
		if(!args[0]) {
			const player = client.music.players.get(message.guild.id);
			if(!player) return message.channel.send('Please provide a song to search for lyrics or play a song.');
			else song = player.queue[0].title;
		}
		else {song = args.join(' ');}


		const data = await ksoft.lyrics.get(song, false)
			.catch(err => {
				return message.channel.send(err.message);
			});
		if (data.lyrics.length > 2048) return msg.edit('Lyrics were too long.');
		const embed = new Discord.MessageEmbed()
			.setTitle(`${data.name}`)
			.setAuthor(`${data.artist.name}`)
			.setDescription(data.lyrics)
			.setColor(client.colors.main)
			.setFooter('Powered by KSoft.Si');
		msg.edit('', embed);
	},
};