/* eslint-disable no-unused-vars */

module.exports = async (client, channelID, message) => {
	client.shard.broadcastEval(send, { context: { channelID: channelID, message: message } });

	function send(client, { channelID, message }) {
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