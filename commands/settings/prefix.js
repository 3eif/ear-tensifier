const Discord = require("discord.js"); 
const { typing } = require("../../recourses/emojis.json");
const { main } = require("../../recourses/colors.json");
const servers = require("../../models/server.js");
const mongoose = require("mongoose");




module.exports = {
  name: "prefix",
  description: "Set the prefix for the server",
  usage: "<prefix>",
  aliases: ['setprefix'],
  async execute (client, message, args) {

    if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`You must have \`Manage Guild\` permission to use this command.`);

    if(!args[0]) {
        servers.findOne({
            serverID: message.guild.id
        }, async (err, s) => {
            if (err) console.log(err);
            if (!s) {
                const newSever = new servers({
                  serverID: message.guild.id,
                  serverName: message.guild.name,
                  prefix: client.settings.prefix,                    
                });
                await newSever.save().catch(e => console.log(e));
            }
            return message.channel.send(`The current prefix is ${s.prefix}`);
        });
    }
    if(!args[0]) return;

    let f = args[0].replace("_", " ");
    const msg = await message.channel.send(`${typing} Setting prefix to ${f}...`);

    servers.findOne({
        serverID: message.guild.id
    }, async (err, s) => {
        if (err) console.log(err);
        if (!s) {
            const newSever = new servers({
              serverID: message.guild.id,
              serverName: message.guild.name,
              prefix: client.settings.prefix,     
              ignore: [],               
            });
            await newSever.save().catch(e => console.log(e));
        }

        s.prefix = f;
        await s.save().catch(e => console.log(e));
        const embed = new Discord.MessageEmbed()
        .setAuthor(`${message.guild.name}`, message.guild.iconURL())
        .setColor(main)
        .setDescription(`Successfully set the prefix to \`${f}\``)
        msg.edit("", embed);
    });
  },
};