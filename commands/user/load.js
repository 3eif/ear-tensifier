const Discord = require("discord.js");
const emojis = require("../../recourses/emojis.json");
const colors = require("../../recourses/colors.json");
const users = require("../../models/user.js");
const { Utils } = require("erela.js");
let { getData, getPreview } = require("spotify-url-info");

module.exports = {
    name: "load",
    description: "Loads your favorite songs to the queue.",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("You need to be in a voice channel to play music");

        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has("CONNECT")) return message.channel.send("I do not have permission to join your voice channel.");
        if (!permissions.has("SPEAK")) return message.channel.send("I do not have permission to speak in your voice channel.");

        const player = client.music.players.spawn({
            guild: message.guild,
            textChannel: message.channel,
            voiceChannel: voiceChannel
        });

        if (player.pause == "paused") return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);

        const msg = await message.channel.send(`${emojis.cd}  Loading favorites...`)

        users.findOne({
            authorID: message.author.id
        }, async (err, u) => {
            if (err) console.log(err);

            let content = new Promise(async function (resolve, reject) {
                if (u.favorites && u.favorites.length) {
                    for (let i = 0; i < u.favorites.length; i++) {
                        if (u.favorites[i].startsWith("https://open.spotify.com")) {
                            const track = await getData(u.favorites[i])
                            console.log(track.name);
                            str += `[${track.name}](${u.favorites[i]}) (${Utils.formatTime(track.duration_ms, true)})\n`;
                        } else {
                            client.music.search(u.favorites[i], message.author.id).then(async res => {
                                switch (res.loadType) {
                                    case "TRACK_LOADED":
                                        str += `[${res.tracks[0].title}](${u.favorites[i]}) (${res.tracks[0].duration})\n`
                                        console.log(`[${res.tracks[0].title}](${u.favorites[i]}) (${res.tracks[0].duration})`)
                                        break;

                                    case "SEARCH_RESULT":
                                        break;

                                    case "PLAYLIST_LOADED":
                                        break;
                                }
                            });
                        }
                        if (u.favorites.length == i + 1) resolve();
                    }
                } else {
                    str = `You have no favorites. To add favorites type \`ear add <search query/link>\``
                    resolve();
                }
            });

            content.then(async function () {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle("Favorite Songs")
                    .setDescription(str)
                    .setColor(colors.main)
                    .setTimestamp()
                msg.edit("", embed);
                await u.save().catch(e => console.log(e));
            })
        });
    },
};