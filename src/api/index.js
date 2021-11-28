const express = require('express');
const cors = require('cors');

const Bot = require('../models/Bot');
const app = express();
const port = 3000;

module.exports = client => {
    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.get('/commands', (req, res) => {
        client.logger.api('Received get request for /commands');
        const commands = [];
        client.commands.forEach(command => {
            commands.push({
                name: command.name,
                description: command.description,
                args: command.args,
                aliases: command.aliases,
                isEnabled: command.isEnabled,
                hide: command.hide,
                cooldown: command.cooldown,
                voiceRequirements: command.voiceRequirements,
                permissions: command.permissions,
                options: command.options,
                slashCommand: command.slashCommand,
                guildOnly: command.guildOnly,
                category: command.category,
            });
        });
        res.send(commands);
    });

    app.get('/statistics', async (req, res) => {
        client.logger.api('Received get request for /statistics');
        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval(c => c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)),
            client.shard.broadcastEval(c => c.music.players.size),
        ];

        Promise.all(promises)
            .then(async results => {
                const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
                const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
                const totalPlayers = results[2].reduce((prev, playerCount) => prev + playerCount, 0);
                const bot = await Bot.findById(client.user.id);

                const stats = {
                    guilds: totalGuilds,
                    users: totalMembers,
                    players: totalPlayers,
                    commandsUsed: bot.commandsUsed,
                    songsPlayed: bot.songsPlayed,
                };

                res.send(stats);
            }).catch(err => client.logger.error(err));
    });

    app.listen(port, () => {
        client.logger.api(`API listening at http://localhost:${port}`);
    });
};