const Command = require('../../structures/Command');
const Server = require('../../models/Server');

module.exports = class Set extends Command {
    constructor(client) {
        super(client, {
            name: 'set',
            description: {
                content: 'Sets a certain setting.',
                usage: 'set default <setting (volume)>',
                examples: ['set default volume 200'],
            },
            args: true,
            permissions: {
                userPermissions: ['MANAGE_CHANNELS'],
            },
            options: [
                {
                    name: 'default',
                    description: 'Sets the default setting for something',
                    type: 2,
                    options: [
                        {
                            name: 'volume',
                            description: 'Sets the default volume level of the server',
                            type: 1,
                            options: [
                                {
                                    name: 'level',
                                    type: 4,
                                    required: true,
                                    description: 'The volume level to set the default to.',
                                },
                            ],
                        },
                    ],
                },
            ],
            slashCommand: true,
        });
    }
    async run(client, ctx, args) {
        if (ctx.isInteraction) {
            const subCommand = ctx.interaction.options.data[0].name;
            const subSubCommand = ctx.interaction.options.data[0].options[0].name;
            switch (subCommand) {
                case 'default':
                    switch (subSubCommand) {
                        case 'volume':
                            setDefaultVolume(ctx.interaction.options.data[0].options[0].options[0].value);
                    }

                    break;
                default:
                    return ctx.sendMessage('Not a valid subcommand.');
            }
        }
        else {
            const subCommand = args[0].toLowerCase();
            if (subCommand === 'default') {
                const subSubCommand = args[1].toLowerCase();
                const subSubSubCommand = args[2].toLowerCase();
                switch (subSubCommand) {
                    case 'volume':
                        setDefaultVolume(subSubSubCommand);
                        break;
                    default:
                        return ctx.sendMessage('Not a valid subcommand. Please do `ear help set` for more information on this command.');
                }
            }
            else {
                return ctx.sendMessage('Not a valid subcommand. Please do `ear help set` for more information on this command.');
            }
        }

        async function setDefaultVolume(volume) {
            if (isNaN(volume)) return ctx.sendMessage('Volume level must be a number.');
            if (volume < 0) return ctx.sendMessage('Volume level must be greater than 0.');

            Server.findById(ctx.guild.id, async (err, s) => {
                if (err) return client.logger.error(err);
                s.defaults.volume = volume;
                await s.save().catch(e => client.logger.error(e));
            });
            ctx.sendMessage(`Set default volume to ${volume}.`);
        }
    }
};