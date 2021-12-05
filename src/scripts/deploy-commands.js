const fs = require('fs');
const signale = require('signale');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client } = require('../structures/Client');
require('events').defaultMaxListeners = 15;
require('custom-env').env(true);

const debug = false;
const commands = [];
const commandFiles = fs.readdirSync('./src/commands');

signale.config({
    displayFilename: true,
    displayTimestamp: true,
    displayDate: false,
});

let i = 0;
commandFiles.forEach(category => {
    const categories = fs.readdirSync(`./src/commands/${category}/`).filter(file => file.endsWith('.js'));
    categories.forEach(command => {
        const f = require(`../commands/${category}/${command}`);
        const cmd = new f(Client);
        if (cmd.slashCommand) {
            const data = {
                name: cmd.name,
                description: cmd.description.content,
                options: cmd.options,
            };
            commands.push(data);
            if (debug) signale.debug(i + ': ' + JSON.stringify(data));
            else signale.debug(`${i}. ${data.name}: ${data.description}`);
            i++;
        }
    });
});

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

if (process.env.NODE_ENV === 'development') {
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, '473426453204172811'), { body: commands })
        .then(() => signale.success('Successfully registered application commands.'))
        .catch((e) => signale.error(e));
}
else {
    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
        .then(() => signale.success('Successfully registered application commands.'))
        .catch((e) => signale.error(e));
}