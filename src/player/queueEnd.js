module.exports = async (client, player) => {
	return client.manager.players.destroy(player.guild.id);
};