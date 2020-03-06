const Discord = require ("discord.js"); 
const { typing } = require("../data/emojis.json");
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const commandsFile = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

module.exports = {
  name: "help",
  description: "Sends you a dm of detailed list of Ear Tensifier's commands.",
  aliases: ["commands", "list"],
  cooldown: "30",
  usage: `[command name]`,
  async execute (client, message, args) {
      
    const msg = await message.channel.send(`${typing} Sending a list of my commands...`);

    const user = message.member;    
    const { commands } = message.client;
    const data = [];

    let helpCommands = [];
    let helpStr2 = "";

    if (!args.length) {      
        for(let i = 1; i < commandsFile.length; i++){
            let c = commandsFile[i].split('.')[0];
            let comInfo = commands.get(c);
            if(comInfo.permission != "dev" && (comInfo.description != null || comInfo.description != undefined)) helpCommands.push(`**${c}** - ${comInfo.description.toLowerCase()}`);
        }

        for(let i = 0; i < helpCommands.length; i++){
            helpStr2 += helpCommands[i] + "\n";
        }

      const helpStr = 
`
**List of available commands**
Type \`${client.settings.prefix}<command>\` to use a command. 
To get more info on a specific command do \`${client.settings.prefix}help <command>\`

${helpStr2}
Need more help? Join the support server: ${client.settings.server}
Website: https://eartensifier.com
`;

      try {
        await user.send(helpStr);
        msg.edit(`Sent you a dm with my commands <@${message.author.id}>!`);
      } catch (e) {
        return msg.edit(`Your dms are disabled  <@${message.author.id}>, here are my commands:
${helpStr}
          `);
      }
    } else {

      if (!commands.has(args[0])) {
        return message.reply("That's not a valid command!");
      }
      const command = commands.get(args[0]);

      data.push(`**Name:** ${command.name}`);

      if (command.description) data.push(`**Description:** ${command.description}`);
      if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
      if (command.usage) data.push(`**Usage:** \`${client.settings.prefix}${command.name} ${command.usage}\``);

      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

      msg.delete();
      message.channel.send(data, { split: true });
    }
  },
};