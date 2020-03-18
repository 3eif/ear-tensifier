const Discord = require("discord.js");

const users = require("../../models/user.js");
const play = require("../../utils/play.js")
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

        const msg = await message.channel.send(`${client.emojiList.cd}  Loading favorites (This might take a while)...`)

        users.findOne({
            authorID: message.author.id
        }, async (err, u) => {
            if (err) console.log(err);

            let content = new Promise(async function (resolve, reject) {
                if (u.favorites && u.favorites.length) {
                    for(let i = 0; i < u.favorites.length; i++){
                        player.queue.push(u.favorites[i]);
                        if (!player.playing) player.play();
                        if(i == u.favorites.length-1) resolve();
                    }
                } else {
                    return msg.edit(`You have no favorites. To add favorites type \`ear add <search query/link>\``)
                }
            });

            content.then(async function () {
                msg.edit(`Loaded **${u.favorites.length} songs** into the queue. Type \`${client.settings.prefix}queue\` to see the queue.`);
            })
        });
    },
};