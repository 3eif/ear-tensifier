/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const fetch = require('node-fetch');
const users = require('../../models/user.js');
const { Utils } = require('erela.js');
const columnify = require('columnify');

module.exports = {
	name: 'favorites',
	description: 'Displays a list of your favorite songs.',
	cooldown: 10,
	async execute(client, message) {
		const msg = await message.channel.send(`${client.emojiList.loading} Fetching favorites (This might take a while)...`);

		users.findOne({
			authorID: message.author.id,
		}, async (err, u) => {
			if (err) console.log(err);
			let str = '';
			const songs = [];

			// eslint-disable-next-line no-async-promise-executor
			const content = new Promise(async function(resolve) {
				for (let i = 0; i < u.favorites.length; i++) {
					const song = u.favorites[i];
					const url = `https://www.youtube.com/watch?v=${song.identifier}`;
					str += `**${i + 1}** - [${song.title}](${url}) (${Utils.formatTime(song.duration, true)}) by ${song.author}\n`;
					const songObj = {
						number: i + 1,
						song: song.title,
						duration: Utils.formatTime(song.duration, true),
					};
					songs.push(songObj);
				}
				resolve();
			});

			content.then(async function() {
				if (str.length < 2048) {
					const embed = new Discord.MessageEmbed()
						.setAuthor(message.author.tag, message.author.displayAvatarURL())
						.setThumbnail(message.author.displayAvatarURL())
						.setTitle('Favorite Songs')
						.setDescription(str)
						.setColor(client.colors.main)
						.setTimestamp();
					msg.edit('', embed);
				}
				else {
					const columns = columnify(songs, {
						minWidth: 5,
						columnSplitter: ' | ',
						config: {
							song: { maxWidth: 125 },
						},
					});

					const myHeaders = new fetch.Headers();
					myHeaders.append('Content-Type', 'text/plain');
					const requestOptions = {
						method: 'POST',
						headers: myHeaders,
						body: columns,
						redirect: 'follow',
					};

					fetch('https://hasteb.in/documents', requestOptions)
						.then(response => response.text())
						.then(result => {
							

							const embed = new Discord.MessageEmbed()
							.setTitle('Too many favorite songs, uploaded to hastebin!')
							.setURL(`https://www.hasteb.in/${result.slice(8, result.length - 2)}.js`)
							.setColor(client.colors.main);
							msg.edit('', embed);
						})
						.catch(error => console.log('error', error));
				}
				await u.save().catch(e => console.log(e));
			});
		});
	},
};