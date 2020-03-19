const Discord = require("discord.js");
const { post } = require("snekfetch");
const users = require("../../models/user.js");
const { Utils } = require("erela.js");
const columnify = require('columnify')

module.exports = {
    name: "favorites",
    description: "Displays a list of your favorite songs.",
    cooldown: 10,
    async execute(client, message, args) {
        const msg = await message.channel.send(`${client.emojiList.loading} Fetching favorites (This might take a while)...`);

        users.findOne({
            authorID: message.author.id
        }, async (err, u) => {
            if (err) console.log(err);
            let str = "";
            let hastebinStr = "";
            let songs = [];

            let content = new Promise(async function (resolve, reject) {
                for (let i = 0; i < u.favorites.length; i++) {
                    let song = u.favorites[i];
                    let url = `https://www.youtube.com/watch?v=${song.identifier}`;
                    str += `**${i+1}** - [${song.title}](${url}) (${Utils.formatTime(song.duration, true)}) by ${song.author}\n`;
                    hastebinStr += `${i+1} - ${song.title} (${Utils.formatTime(song.duration, true)}) by [${song.author}]\n`;
                    let songObj = {
                        number: i + 1,
                        song: song.title,
                        duration: Utils.formatTime(song.duration, true),
                    }
                    songs.push(songObj)
                }
                resolve();
            });

            content.then(async function () {
                if (str.length < 2048) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setThumbnail(message.author.displayAvatarURL())
                        .setTitle("Favorite Songs")
                        .setDescription(str)
                        .setColor(client.colors.main)
                        .setTimestamp()
                    msg.edit("", embed);
                } else {
                    let columns = columnify(songs, {
                        minWidth: 5,
                        columnSplitter: ' | ',
                        config: {
                            song: { maxWidth: 125 }
                        }
                    })
                    const { body } = await post("https://www.hastebin.com/documents").send(columns);
                    const embed = new Discord.MessageEmbed()
                        .setTitle("Too many favorite songs, uploaded to hastebin!")
                        .setURL(`https://www.hastebin.com/${body.key}.js`)
                        .setColor(client.colors.main);
                    msg.edit("", embed);
                }
                await u.save().catch(e => console.log(e));
            })
        });
    },
};