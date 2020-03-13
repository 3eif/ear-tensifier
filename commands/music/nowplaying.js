const Discord = require("discord.js");
;

const { Utils } = require("erela.js");
const { stripIndents } = require("common-tags");

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
        .setThumbnail(player.queue[0].displayThumbnail("default"))
        .setDescription(`[${title}](${uri})`)
        .addField("Duration", Utils.formatTime(duration, true), true)
        .addField("Requested by", requester, true)
        return message.channel.send(embed);

    } else {
      let amount = `${Utils.formatTime(player.position, true)}`
      const part = Math.floor((player.position / duration) * 10);
      const embed = new Discord.MessageEmbed()
        .setColor(client.colors.main)
        .setTitle(player.playing ? "Now Playing" : "Paused")
        .setThumbnail(player.queue[0].displayThumbnail("default"))
        .setDescription(`[${title}](${uri})\n\n${amount}   ${"▬".repeat(part) + "⚪" + "▬".repeat(10 - part)}   ${Utils.formatTime(duration, true)}`)
        .addField("Author", author, true)
        .addField("Requested by", requester, true)

      message.channel.send("", { embed: embed }).then(m => {
        const counter = setInterval(() => {
          if (player.playing !== true) {
            clearInterval(counter)
          }

          if (player.position < 60000) {
            if (player.position > 5000) {
              if (player.playing === true) {
                let { title, author, duration, thumbnail, requester } = player.queue[0];
                let amount = `${Utils.formatTime(player.position, true)}`
                const part = Math.floor((player.position / duration) * 10);
                embed.setDescription(`[${title}](${uri})\n\n${amount}   ${"▬".repeat(part) + "⚪" + "▬".repeat(10 - part)}   ${Utils.formatTime(duration, true)}`)
              }
            }
          } else {
            if (player.playing === true && player.position > 5000) {
              let { title, author, duration, thumbnail, requester } = player.queue[0];
              const amount = `${Utils.formatTime(player.position, true)}`
              const part = Math.floor((player.position / duration) * 10);
              embed.setDescription(`[${title}](${uri})\n\n${amount}   ${"▬".repeat(part) + "⚪" + "▬".repeat(9 - part)}   ${Utils.formatTime(duration, true)}`)
            }
          }
          m.edit("", embed)
        }, 10000)
      })
    }
  }
}