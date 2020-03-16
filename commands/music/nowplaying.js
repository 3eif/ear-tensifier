const Discord = require("discord.js");
const { Utils } = require("erela.js");

module.exports = {
  name: "nowplaying",
  description: "Displays the song that is currently playing",
  aliases: ["playing", "np"],
  async execute(client, message, args) {
    const player = client.music.players.get(message.guild.id);
    if (!player) return message.channel.send("No songs playing.")

    let { title, author, duration, requester, uri } = player.queue[0];
    if (player.position < 5000) {
      const embed = new Discord.MessageEmbed()
        .setColor(client.colors.main)
        .setTitle(player.playing ? "Now Playing" : "Paused")
        .setThumbnail(player.queue[0].displayThumbnail("maxresdefault"))
        .setDescription(`[${title}](${uri})\n[${Utils.formatTime(duration, true)}]`)
        .addField("Author", author, true)
        .addField("Requested by", requester, true)
        return message.channel.send(embed);
    } else {
      let amount = `${Utils.formatTime(player.position, true)}`
      const part = Math.floor((player.position / duration) * 10);
      const embed = new Discord.MessageEmbed()
        .setColor(client.colors.main)
        .setTitle(player.playing ? "Now Playing" : "Paused")
        .setThumbnail(player.queue[0].displayThumbnail("maxresdefault"))
        .setDescription(`[${title}](${uri})\n[${amount}/${Utils.formatTime(duration, true)}]`)
        .addField("Author", author, true)
        .addField("Requested by", requester, true)
      return message.channel.send("", embed);
    }
  }
}