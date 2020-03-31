module.exports = {
	name: 'donate',
	description: 'Sends a link to Ear Tensifier\'s patreon page.',
	aliases: ['patreon'],
	hideInList: true,
	async execute(client, message) {
		return message.channel.send('Donate: https://www.patreon.com/eartensifier');
	},
};