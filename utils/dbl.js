const DBL = require('dblapi.js');
const Discord = require('discord.js');

const { post } = require('../tokens.json');
const webhooks = require('../resources/webhooks.json');
const webhookClient = new Discord.WebhookClient(webhooks.voteID, webhooks.voteToken);

module.exports.startUp = async (client) => {
	const dbl = new DBL(post['topGG']['token'], { webhookPort: 5000, webhookAuth: post['topGG']['password'] }, client);

	dbl.webhook.on('ready', async (hook) => {
		console.log(`Top.gg webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
	});

	dbl.webhook.on('vote', async (voter) => {
		try {
			const person = await client.users.fetch(voter.user);
			const embed = new Discord.MessageEmbed()
				.setAuthor(`${person.tag} - (${person.id})`, person.displayAvatarURL())
				.setDescription(`**${person.username}** voted for the bot!`)
				.setThumbnail(person.displayAvatarURL())
				.setColor(client.colors.main)
				.setTimestamp();

			webhookClient.send({
				username: 'Ear Tensifier',
				avatarURL: client.settings.avatar,
				embeds: [embed],
			});
		}
		catch (e) {
			console.log(e);
		}
	});
};