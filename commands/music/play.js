const play = require("../../utils/play.js")
const patreon = require("../../resources/patreon.json")
const premium = require('../../utils/premium/premium.js');
const { getData, getPreview } = require("spotify-url-info");

module.exports = {
    name: "play",
    description: "Plays a song",
    args: true,
    usage: "<search query>",
    aliases: ["p"],
    cooldown: '5',
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return client.responses("noVoiceChannel", message)

        const permissions = voiceChannel.permissionsFor(client.user);
        if(!permissions.has("CONNECT")) return client.responses("noPermissionConnect", message)
        if(!permissions.has("SPEAK")) return client.responses("noPermissionSpeak", message)

        const player = client.music.players.spawn({
            guild: message.guild,
            textChannel: message.channel,
            voiceChannel: voiceChannel
        });

        if (player.pause == "paused") return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);

        const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(" ")}\`...`)

        if(await songLimit() == patreon.defaultMaxSongs && player.queue.size >= patreon.defaultMaxSongs) return msg.edit(`You have reached your **maximum** amount of favorite songs (${patreon.defaultMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`) 
        if(await songLimit() == patreon.premiumMaxSongs && player.queue.size >= patreon.premiumMaxSongs) return msg.edit(`You have reached your **maximum** amount of favorite songs (${patreon.premiumMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`) 
        if(await songLimit() == patreon.proMaxSongs && player.queue.size >= patreon.proMaxSongs) return msg.edit(`You have reached your **maximum** amount of favorite songs (${patreon.proMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`) 

        let searchQuery;
        if (args[0].startsWith("https://open.spotify.com")) {
            const data = await getData(args.join(" "));
            if (data.type == "playlist" || data.type == "album") {
                // let sL = await songLimit();
                // console.log(sL);
                // let songsToAdd = 0;
                // let totalSongs = player.queue.length + data.tracks.items.length;
                // console.log(totalSongs);
                // if(totalSongs > sL) songsToAdd = totalSongs - (totalSongs-sL);
                // else songsToAdd = data.tracks.items.length;
                if (data.type == "playlist") {
                    for(let i = 0; i < data.tracks.items.length; i++){
                        let song = data.tracks.items[i];
                        play(client, message, msg, player, `${song.track.name} ${song.track.artists[0].name}`, true);
                    }
                } else {
                    await data.tracks.items.forEach(song => {
                        play(client, message, msg, player, `${song.name} ${song.artists[0].name}`, true);
                    });
                }
                let playlistInfo = await getPreview(args.join(" "));
                // if(data.tracks.items.length != songsToAdd){
                //     if(await songLimit() == patreon.defaultMaxSongs) msg.edit(`**${playlistInfo.title}** (${songsToAdd} tracks) has been added to the queue by **${message.author.tag}**\nYou have reached your **maximum** amount of favorite songs (${patreon.defaultMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`)
                //     else if(await songLimit() == patreon.premiumMaxSongs) msg.edit(`**${playlistInfo.title}** (${songsToAdd} tracks) has been added to the queue by **${message.author.tag}**\nYou have reached your **maximum** amount of favorite songs (${patreon.premiumMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`)
                //     else if(await songLimit() == patreon.proMaxSongs) msg.edit(`**${playlistInfo.title}** (${songsToAdd} tracks) has been added to the queue by **${message.author.tag}**\nYou have reached your **maximum** amount of favorite songs (${patreon.proMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`)
                // } else 
                msg.edit(`**${playlistInfo.title}** (${data.tracks.items.length} tracks) has been added to the queue by **${message.author.tag}**`);
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

        async function songLimit(){
            let hasPremium = await premium(message.author.id, "Premium");
            let hasPro = await premium(message.author.id, "Pro");
            if(!hasPremium && !hasPro) return patreon.defaultMaxSongs;
            if(hasPremium && !hasPro) return patreon.premiumMaxSongs;
            if(hasPremium && hasPro) return patreon.proMaxSongs;
        }
    },
};