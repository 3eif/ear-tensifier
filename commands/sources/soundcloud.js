const play = require("../../utils/play.js")

module.exports = {
    name: "soundcloud",
    description: "Plays a song from soundcloud.",
    args: true,
    usage: "<search query>",
    async execute(client, message, args) {        const voiceChannel = message.member.voice.channel;;
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

        const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(" ")}\`...`)

        let searchQuery = args.join(" ")
        searchQuery = {
            source: "soundcloud",
            query: args.slice(0).join(" ")
        }
        play(client, message, msg, player, searchQuery , false);
    },
};