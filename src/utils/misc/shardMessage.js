/* eslint-disable no-unused-vars */
const MessageEmbed = require("discord.js");

module.exports = async (client, channelID, message, MessageEmbed) => {
	client.shard.broadcastEval(send, { context: { channelID: channelID, message: message, messageEmbed: MessageEmbed } });

	function send(client, { channelID, message, MessageEmbed }) {
		let channel = client.channels.cache.get(channelID);
		if (channel) {
			if (typeof message == "string") {
				channel.send(message);
			} else {
				channel.send({ embeds: [message] });
			}
		}
	}
};