const premium = require('../../utils/premium/premium.js');
const Discord = require('discord.js');

module.exports = {
	name: 'bassboost',
	description: 'Bassboosts a song',
	aliases: ['bb'],
	cooldown: '10',
	usage: '<amount (-10 - 10)>',
	async execute(client, message, args) {
		const voiceChannel = message.member.voice.channel;
		const player = client.music.players.get(message.guild.id);

		if(!voiceChannel) return client.responses('noVoiceChannel', message);
		if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

		if(!player) return client.responses('noSongsPlaying', message);

		const delay = ms => new Promise(res => setTimeout(res, ms));

		if(!args[0]) {
			player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.65 })));
			const msg = await message.channel.send(`${client.emojiList.loading} Turning on **bassboost**. This may take a few seconds...`);
			const embed = new Discord.MessageEmbed()
				.setAuthor(message.guild.name, message.guild.iconURL())
				.setDescription('Bassboost on')
				.setFooter('Reset filter: ear reset')
				.setColor(client.colors.main);
			await delay(5000);
			return msg.edit('', embed);
		}

		if(args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off') {
			player.setEQ(Array(13).fill(0).map((n, i) => ({ band: i, gain: 0.15 })));
			const msg = await message.channel.send(`${client.emojiList.loading} Turning off **bassboost**. This may take a few seconds...`);
			const embed = new Discord.MessageEmbed()
				.setAuthor(message.guild.name, message.guild.iconURL())
				.setDescription('Bassboost off')
				.setColor(client.colors.main);
			await delay(5000);
			return msg.edit('', embed);
		}

		if(isNaN(args[0])) return message.channel.send('Amount must be a real number.');

		if(args[0] > 10 || args[0] < -10) {
			if(await premium(message.author.id, 'Premium') == false) {
				return message.channel.send('Only **Premium** users can set the bassboost higher. Click here to get premium: https://www.patreon.com/join/eartensifier');
			}
			else {player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: args[0] / 10 })));}
		}
		else {player.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: args[0] / 10 })));}

		const msg = await message.channel.send(`${client.emojiList.loading} Setting bassboost to **${args[0]}dB**. This may take a few seconds...`);
		const embed = new Discord.MessageEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL())
			.setDescription(`Bassboost set to: **${args[0]}dB**`)
			.setFooter('Default bassboost: 0')
			.setColor(client.colors.main);
		await delay(5000);
		return msg.edit('', embed);
	},
};