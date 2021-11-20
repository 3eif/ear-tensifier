const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');
const Server = require('../../models/Server');

module.exports = class Listen extends Command {
    constructor(client) {
        super(client, {
            name: 'listen',
            description: {
                content: 'The bot will resume responding to commands from a specific channel.',
                usage: '[all/only/channel] <channel>',
                examples: ['#general', 'only #general', 'channel #general', 'all'],
            },
            args: true,
            permissions: {
                userPermissions: ['MANAGE_CHANNELS'],
            },
            options: [
                {
                    name: 'channel',
                    description: 'Resumes responding to commands coming from the channel you provide.',
                    type: 1,
                    options: [
                        {
                            name: 'name',
                            type: 7,
                            required: true,
                            description: 'The channel to resuming listening to commands in.',
                        },
                    ],
                },
                {
                    name: 'all',
                    description: 'Resumes responding to commands from all channels.',
                    type: 1,
                },
                {
                    name: 'only',
                    description: 'Resumes responding to commands from only the channel you provide.',
                    type: 1,
                    options: [
                        {
                            name: 'name',
                            type: 7,
                            required: true,
                            description: 'The only channel to listen to commands from.',
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
            switch (subCommand) {
                case 'all':
                    listenAll();
                    break;
                case 'only':
                    listenOnly(ctx.interaction.options.data[0].options[0].channel.id);
                    break;
                default:
                    listenChannel(ctx.interaction.options.data[0].options[0].channel.id);
                    break;
            }
        }
        else {
            const subCommand = args[0].toLowerCase();
            if (subCommand == 'all') listenAll();
            else if (subCommand == 'only') {
                let channel;
                if (ctx.message.mentions.channels.first() === undefined) {
                    if (!isNaN(args[1])) channel = args[1];
                    else return ctx.editMessage('No channel detected.');
                }
                else {
                    channel = ctx.message.mentions.channels.first().id;
                }
                listenOnly(channel);
            }
            else if (subCommand == 'channel') {
                let channel;
                if (ctx.message.mentions.channels.first() === undefined) {
                    if (!isNaN(args[1])) channel = args[1];
                    else return ctx.editMessage('No channel detected.');
                }
                else {
                    channel = ctx.message.mentions.channels.first().id;
                }
                listenChannel(channel);
            }
            else {
                let channel;
                if (ctx.message.mentions.channels.first() === undefined) {
                    if (!isNaN(args[0])) channel = args[0];
                    else return ctx.editMessage('No channel detected.');
                }
                else {
                    channel = ctx.message.mentions.channels.first().id;
                }
                listenChannel(channel);
            }
        }

        async function listenOnly(channel) {
            await ctx.sendDeferMessage(`${client.config.emojis.typing} Ignoring commands from all channels except <#${channel}>...`);

            Server.findById(ctx.guild.id, async (err, s) => {
                if (err) client.logger.error(err);

                const channelsToIgnore = [];
                ctx.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').each(c => {
                    if (c.id !== channel) channelsToIgnore.push(c.id);
                });
                await s.updateOne({ ignoredChannels: channelsToIgnore }).catch(e => client.logger.error(e));

                const embed = new MessageEmbed()
                    .setAuthor(`${ctx.guild.name}`, ctx.guild.iconURL())
                    .setColor(client.config.colors.default)
                    .setDescription(`I will now only listen to commands from <#${channel}>.`)
                    .setFooter(`Tip: You can make me listen to commands in all channels again by doing ${await ctx.messageHelper.getPrefix()}listenall`);
                ctx.editMessage({ content: null, embeds: [embed] });
            });
        }

        async function listenAll() {
            await ctx.sendDeferMessage(`${client.config.emojis.typing} Listening to commands from all channels...`);

            Server.findById(ctx.guild.id, async (err, s) => {
                if (err) client.logger.error(err);
                await s.updateOne({ ignoredChannels: [] }).catch(e => client.logger.error(e));

                const embed = new MessageEmbed()
                    .setAuthor(`${ctx.guild.name}`, ctx.guild.iconURL())
                    .setColor(client.config.colors.default)
                    .setDescription('I will now listen to commands from all channels.');
                ctx.editMessage({ content: null, embeds: [embed] });
            });
        }

        async function listenChannel(channel) {
            await ctx.sendDeferMessage(`${client.config.emojis.typing} Listening to commands from <#${channel}>...`);

            Server.findById(ctx.guild.id, async (err, s) => {
                if (err) client.logger.error(err);
                if (s.ignoredChannels.includes(channel)) {
                    for (let i = 0; i < s.ignoredChannels.length; i++) {
                        if (s.ignoredChannels[i] === channel) {
                            s.ignoredChannels.splice(i, 1);
                            await s.updateOne({ ignoredChannels: s.ignoredChannels }).catch(e => client.log(e));
                            break;
                        }
                    }
                }
                else return ctx.editMessage('This channel is not being ignored!');

                const embed = new MessageEmbed()
                    .setAuthor(`${ctx.guild.name}`, ctx.guild.iconURL())
                    .setColor(client.config.colors.default)
                    .setDescription(`I will now listen to commands from <#${channel}>.`);
                ctx.editMessage({ content: null, embeds: [embed] });
            });
        }
    }
};