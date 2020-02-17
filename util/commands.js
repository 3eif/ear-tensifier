const fs = require("fs");
const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const commands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

module.exports = client => {
    try {
        const init = async () => {
            let commandNum = 0;
            for (const file of commands) {
              const command = require(`../commands/${file}`);
              client.commands.set(command.name, command);
              commandNum++;
            }
            //console.log(`Loaded a total of ${commandNum} commands`);
        };
        init();
    } catch (error) {
        console.log(error);
    }
}