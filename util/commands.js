const fs = require("fs");
const { promisify } = require("util");
const categories = fs.readdirSync('./commands/');
let commandNum = 0;

module.exports = client => {
    try {
        categories.forEach(async (category) => {
            fs.readdir(`./commands/${category}/`, (err) => {
                if (err) return console.error(err);
                const init = async () => {
                    const commands = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith(".js"));
                    for (const file of commands) {
                        const command = require(`../commands/${category}/${file}`);
                        client.commands.set(command.name, command);
                        commandNum++;
                    }
                };
                init();
            });
        })
    } catch (error) {
        console.log(error);
    }
}