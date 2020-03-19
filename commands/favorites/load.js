const users = require("../../models/user.js");
const premium = require('../../utils/premium/premium.js');
const patreon = require("../../resources/patreon.json")

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

        if (await songLimit() == patreon.defaultMaxSongs && player.queue.size >= patreon.defaultMaxSongs) return msg.edit(`You have reached the **maximum** amount of songs (${patreon.defaultMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`)
        if (await songLimit() == patreon.premiumMaxSongs && player.queue.size >= patreon.premiumMaxSongs) return msg.edit(`You have reached the **maximum** amount of songs (${patreon.premiumMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`)
        if (await songLimit() == patreon.proMaxSongs && player.queue.size >= patreon.proMaxSongs) return msg.edit(`You have reached the **maximum** amount of songs (${patreon.proMaxSongs} songs). Want more songs? Contact the developer: \`Tetra#0001\``)

        const msg = await message.channel.send(`${client.emojiList.cd}  Loading favorites (This might take a while)...`)

        users.findOne({
            authorID: message.author.id
        }, async (err, u) => {
            if (err) console.log(err);

            let songsToAdd = 0;
            let content = new Promise(async function (resolve, reject) {
                if (u.favorites && u.favorites.length) {
                    let sL = await songLimit();
                    if (player.queue.length == 0) songsToAdd = Math.min(sL, u.favorites.length)
                    else {
                        let totalSongs = player.queue.length + u.favorites.length;
                        if (totalSongs > sL) songsToAdd = Math.min(sL - player.queue.length, u.favorites.length)
                        else songsToAdd = u.favorites.length;
                    }
                    for (let i = 0; i < songsToAdd; i++) {
                        player.queue.push(u.favorites[i]);
                        if (!player.playing) player.play();
                        if (i == songsToAdd - 1) resolve();
                    }
                } else {
                    return msg.edit(`You have no favorites. To add favorites type \`ear add <search query/link>\``)
                }
            });

            content.then(async function () {
                msg.edit(`Loaded **${songsToAdd} songs** into the queue. Type \`${client.settings.prefix}queue\` to see the queue.`);
                let loaded = `Loaded **${songsToAdd} songs** into the queue. Type \`${client.settings.prefix}queue\` to see the queue.`;
                if (u.favorites.length != songsToAdd) {
                    if (await songLimit() == patreon.defaultMaxSongs) msg.edit(`${loaded}.\nYou have reached the **maximum** amount of songs (${patreon.defaultMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`)
                    else if (await songLimit() == patreon.premiumMaxSongs) msg.edit(`${loaded}\nYou have reached the **maximum** amount of songs (${patreon.premiumMaxSongs} songs). Want more songs? Consider donating here: https://www.patreon.com/eartensifier`)
                    else if (await songLimit() == patreon.proMaxSongs) msg.edit(`${loaded}\nYou have reached the **maximum** amount of songs (${patreon.proMaxSongs} songs). Want more songs? Contact \`Tetra#0001\``)
                } else msg.edit(`**${playlistInfo.title}** (${songsToAdd} tracks) has been added to the queue by **${message.author.tag}**`);
            })
        });

        async function songLimit() {
            let hasPremium = await premium(message.author.id, "Premium");
            let hasPro = await premium(message.author.id, "Pro");
            if (!hasPremium && !hasPro) return patreon.defaultMaxSongs;
            if (hasPremium && !hasPro) return patreon.premiumMaxSongs;
            if (hasPremium && hasPro) return patreon.proMaxSongs;
        }
    },
};