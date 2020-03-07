module.exports = {
    name: 'website',
	description: 'Website of the bot.',
    aliases: [`site`],
	async execute(client, message, args){
        message.channel.send(`https://eartensifier.net/`)
	},
};