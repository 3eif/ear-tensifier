const Discord = require("discord.js");
const emojis = require("../../recourses/emojis.json");
const colors = require("../../recourses/colors.json")
const users = require("../../models/user.js");
const mongoose = require("mongoose");
const { modlog } = require("../../recourses/channels.json");



module.exports = {
    name: "unblock",
    description: "Unblocks a person from using the bot.",
    usage: "<user> <reason>",
    args: true,
    permission: "dev",
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send("Please specifiy a user.")
        const reason = args.slice(1).join(" ");
        if (!reason) return message.channel.send(`Please specify a reason for unblocking this user.`);

        const msg = await message.channel.send(`${emojis.loading} Unblocking user from bot...`);

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return msg.edit("Not a valid user.");

        users.findOne({
            authorID: user.id
        }, async (err, u) => {
            if (err) console.log(err);
            if (!u) {
                const newUser = new users({
                    authorID: user.id,
                    authorName: user.tag,
                    bio: "",
                    songsPlayed: 0,
                    commandsUsed: 0,
                    blocked: false,
                    supporter: false,
                    supporterPlus: false,
                    supporterPlusPlus: false,
                    supporterInfinite: false,
                    developer: false,
                });
                newUser.save().catch(e => console.log(e));
            } else {
                //if (u.blocked == null) u.blocked = false;
                if (u.blocked) {
                    u.blocked = false;
                } else if (!u.blocked) {
                    return msg.edit("That user is already unblocked.");
                }
            }

            const username = await client.users.fetch(u.authorID);
            msg.edit(`Unblocked **${user.user.tag}** from the bot.`)
            client.channels.get(modlog).send(`${emojis.whitelist} **${message.author.tag}** (${message.author.id}) unblocked **${user.user.tag}** (${user.id}). Reason: ${reason}`);
            await u.save().catch(e => console.log(e));
        });
    },
};