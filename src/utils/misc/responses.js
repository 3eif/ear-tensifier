const { MessageEmbed } = require('discord.js');
const colors = require('../../../config/colors.js');

module.exports = async (type, message, args) => {
	switch (type) {
		case 'reloadError': {
			message.channel.send(`An error occured while reloading \`${args}\`.`);
			break;
		}
		case 'sameVoiceChannel': {
			message.channel.send('You are not in the same voice channel as the bot.');
			break;
		}
		case 'noVoiceChannel': {
			message.channel.send('You need to be in a voice channel to use this command');
			break;
		}
		case 'noSongsPlaying': {
			message.channel.send('There are no songs currently playing, please play a song to use the command.');
			break;
		}
		case 'noPremium': {
			const embed = new MessageEmbed()
			.setDescription('This command is only available to **Premium** users due to performance issues.\nClick here to get premium: [patreon.com/eartensifier](https://patreon.com/eartensifier)')
			.setColor(colors.main);
			message.channel.send(embed);
			break;
		}
		case 'noPro': {
			const embed = new MessageEmbed()
			.setDescription('This command is only available to **Pro** users due to performance issues.\nClick here to get premium: [patreon.com/eartensifier](https://patreon.com/eartensifier)')
			.setColor(colors.main);
			message.channel.send(embed);
			break;
		}
		case 'botVoiceChannel': {
			message.channel.send('The bot is currently not in a vc.');
			break;
		}
		case 'noPermissionConnect': {
			message.channel.send('I do not have permission to join your voice channel.');
			break;
		}
		case 'noPermissionSpeak': {
			message.channel.send('I do not have permission to speak in your voice channel.');
			break;
		}
		case 'noUser': {
			message.channel.send('Please provide a valid user.');
			break;
		}
		default: {
			message.channel.send(this.client.error());
		}
	}
};