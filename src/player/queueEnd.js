module.exports = async (client, player) => {
	return client.music.players.destroy(player.guild.id);
};