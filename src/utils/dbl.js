const DBL = require('dblapi.js');
const Discord = require('discord.js');

const { post } = require('../tokens.json');
const webhooks = require('../resources/webhooks.json');
const users = require('../models/user.js');
const webhookClient = new Discord.WebhookClient(webhooks.voteID, webhooks.voteToken);

module.exports.startUp = async (client) => {
	const dbl = new DBL(post['topGG']['token'], { webhookPort: post['topGG']['port'], webhookAuth: post['topGG']['password'] }, client);

	dbl.webhook.on('ready', async (hook) => {
		client.log(`Top.gg webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
	});

	dbl.webhook.on('vote', async (voter) => {
		try {
			const votedUser = await client.users.fetch(voter.user);
			const embed = new Discord.MessageEmbed()
				.setAuthor(`${votedUser.tag} - (${votedUser.id})`, votedUser.displayAvatarURL())
				.setDescription(`**${votedUser.username}** voted for the bot!`)
				.setThumbnail(votedUser.displayAvatarURL())
				.setColor(client.colors.main)
				.setTimestamp();

			webhookClient.send({
				username: 'Ear Tensifier',
				avatarURL: client.settings.avatar,
				embeds: [embed],
			});

			users.findOne({
				authorID: votedUser.id,
			}, async (err, u) => {
				if (err) console.log(err);
				if (!u) {
					const newUser = new users({
						authorID: votedUser.id,
						bio: '',
						songsPlayed: 0,
						commandsUsed: 0,
						blocked: false,
						premium: false,
						pro: false,
						developer: false,
						voted: true,
					});
					await newUser.save().catch(e => console.log(e));
				}
				else {
					u.voted = true;
				}
				await u.save().catch(e => console.log(e));
			});
		}
		catch (e) {
			client.log(e);
		}
	});
};