const Command = require('../../structures/Command');

const Discord = require('discord.js');
const songs = require('../../models/song.js');

module.exports = class Charts extends Command {
	constructor(client) {
		super(client, {
			name: 'charts',
			description: 'Shows the most played songs',
			aliases: ['top', 'chart', 'topcharts', 'topchart'],
		});
	}
	async run(client, message) {
		const msg = await message.channel.send(`${client.emojiList.loading} Fetching most played songs...`);

		songs.find().sort([['timesPlayed', 'descending']]).exec(async (err, res) => {
			if (err) client.log(err);
			const songsArr = [];

			for (let i = 0; i < 10; i++) {
				try {
					songsArr.push(`**${i + 1}.** ${res[i].songName} (${res[i].timesPlayed.toLocaleString()} plays)`);
				}
				catch (e) {
					return message.channel.send('An error occured.');
				}
			}

			const embed = new Discord.MessageEmbed()
				.setAuthor('Top Charts', client.settings.avatar)
				.addField('Top Songs', `${songsArr.join('\n')}`)
				.setTimestamp()
				.setColor(client.colors.main);
			msg.edit('', embed);
		});
	}
};