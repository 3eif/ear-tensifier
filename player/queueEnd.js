
module.exports = async (client, player) => {
    //if(await premium(message.author.id, "Premium") == false) return client.responses('noPremium', message);
    return client.music.players.destroy(player.guild.id)
}