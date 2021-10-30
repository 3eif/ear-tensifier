const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('custom-env').env(true);

const commands = [];
const commandFiles = fs.readdirSync('./src/commands');
console.log('hi');
commandFiles.forEach(category => {
    const categories = fs.readdirSync(`./src/commands/${category}/`).filter(file => file.endsWith('.js'));
    console.log(categories);
    categories.forEach(command => {
        const cmd = require(`../commands/${category}/${command}`);
        console.log(cmd.data.toJSON());
        commands.push(cmd.data.toJSON());
    });
});

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, '473426453204172811'), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
