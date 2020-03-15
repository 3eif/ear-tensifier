const Discord = require("discord.js");

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.settings = require("./settings.js");
client.responses = require("./utils/responses.js");
client.filters = require("./resources/filters.json")
client.colors = require("./resources/colors.json");
client.emojiList = require("./resources/emojis.json");
client.errors = require('./utils/errors.js');

["commands","events"].forEach(handler => {
  require(`./utils/handlers/${handler}`)(client)
})

client.login(require("./tokens.json").discordToken);