const emojis = require("../../recourses/emojis.json");
const play = require("../../utils/search.js")

let { getData, getPreview } = require("spotify-url-info");

module.exports = {
    name: "play",
    description: "Plays a song",
    args: true,
    usage: "<search query>",
    aliases: ["p"],
    cooldown: '5',
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

        const msg = await message.channel.send(`${emojis.cd}  Searching for \`${args.join(" ")}\`...`)

        let searchQuery;
        if (args[0].startsWith("https://open.spotify.com")) {
            const data = await getData(args.join(" "));
            console.log(data);
            if (data.type == "playlist" || data.type == "album") {
                if (data.type == "playlist") {
                    await data.tracks.items.forEach(song => {
                        play(client, message, msg, player, `${song.track.name} ${song.track.artists[0].name}`, true);
                    });
                } else {
                    await data.tracks.items.forEach(song => {
                        play(client, message, msg, player, `${song.name} ${song.artists[0].name}`, true);
                    });
                }
                let playlistInfo = await getPreview(args.join(" "));
                msg.edit(`**${playlistInfo.title}** (${data.tracks.items.length} tracks) has been added to the queue by **${message.author.tag}**`)
            } else if (data.type == "track") {
                const track = await getPreview(args.join(" "))
                play(client, message, msg, player, `${track.title} ${track.artist}`, false);
            }
        } else {
            searchQuery = args.join(" ")
            if (["youtube", "soundcloud", "bandcamp", "mixer", "twitch"].includes(args[0].toLowerCase())) {
                searchQuery = {
                    source: args[0],
                    query: args.slice(1).join(" ")
                }
            }
            play(client, message, msg, player, searchQuery, false);
        }
    },
};