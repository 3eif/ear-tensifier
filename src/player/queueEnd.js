const Discord = require('discord.js');

module.exports = async (client, player) => {
	const embed = new Discord.MessageEmbed()
		.setDescription('Queue ended. Enjoying Ear Tensifier? Consider reviewing it **[here](https://bots.ondiscord.xyz/bots/472714545723342848/review)**.')
		.setColor(client.colors.main);
	player.textChannel.send(embed);
	return player.destroy();
};