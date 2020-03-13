const Discord = require("discord.js");


const songs = require("../../models/song.js");

module.exports = {
    name: "charts",
    description: "Shows the most played songs",
    aliases: ['top', 'chart', 'topcharts', 'topchart'],
    async execute(client, message, args) {
        const msg = await message.channel.send(`${loading} Fetching most played songs...`);

        songs.find().sort([["timesPlayed", "descending"]]).exec(async (err, res) => {
            if (err) console.log(err);
            const songsArr = [];
        
            for (var i = 0; i < 10; i++) {
              try {
                songsArr.push(`**${i+1}.** ${res[i].songName} (${res[i].timesPlayed} plays)`);
              } catch (e) {} 
            }
        
            const embed = new Discord.MessageEmbed()
              .setAuthor("Top Charts", client.settings.avatar)
              .addField('Top Songs', `${songsArr.join("\n")}`)
              .setTimestamp()
              .setColor(client.colors.main);
            msg.edit("", embed);
          });
    }
}