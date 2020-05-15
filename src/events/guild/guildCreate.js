const Discord = require('discord.js');
const moment = require('moment');
const Event = require('../../structures/Event');

module.exports = class GuildCreate extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(guild) {
		// eslint-disable-next-line no-unused-vars
		this.client.shard.fetchClientValues('guilds.size').then(guilds => {

			const embed = new Discord.MessageEmbed()
				.setAuthor(`Ear Tensifier | Guild ID: ${guild.id}`, this.client.user.displayAvatarURL())
				.setColor(this.client.colors.online)
				.setThumbnail(guild.iconURL())
				.setDescription('Ear Tensifier has been **ADDED** to a server.')
				.addField('Guild', `${guild.name}`, true)
				.addField('Users', `${guild.memberCount}`, true)
				.addField('Owner', `${guild.owner.user.username}`, true)
				.addField('Region', `${guild.region}`, true)
				.setFooter(`Created On - ${moment(guild.createdAt).format('LLLL')}`, guild.iconURL())
				.setTimestamp();

			this.client.shardMessage(this.client, this.client.channelList.guildChannel, embed);
		});
	}
};