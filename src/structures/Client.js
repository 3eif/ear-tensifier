const Discord = require("discord.js");
const fs = require("fs");

const commandsFolder = fs.readdirSync("./src/commands/");
const listenersFolder = fs.readdirSync("./src/listeners/");
const Logger = require("./Logger.js");
const DatabaseHelper = require("../helpers/DatabaseHelper.js");
const Github = require("gh-check");
const findUpdate = Github({
  GITHUB_USER: "Tetracyl",
  PROJECT_NAME: "EarTensifier",
  AUTO_CHECK: process.env.AUTO_CHECK,
  RUN_UPDATE_CHECK: true,
  AUTO_CHECK_TIME: 3600,
});
module.exports = class Client extends Discord.Client {
  constructor() {
    super({
      allowedMentions: { parse: ["roles"], repliedUser: false },
      makeCache: Discord.Options.cacheWithLimits({
        ...Discord.Options.defaultMakeCacheSettings,
        MessageManager: {
          sweepInterval: 300,
          sweepFilter: Discord.LimitedCollection.filterByLifetime({
            lifetime: 1800,
            getComparisonTimestamp: (e) =>
              e.editedTimestamp || e.createdTimestamp,
          }),
        },
      }),
      partials: ["MESSAGE", "CHANNEL", "REACTION"],
      intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_VOICE_STATES",
        "GUILD_MESSAGE_REACTIONS",
      ],
      restTimeOffset: 0,
    });

    this.commands = new Discord.Collection();
    this.aliases = new Discord.Collection();

    this.statcordSongs = 0;

    this.logger = new Logger(
      {
        displayTimestamp: true,
        displayDate: true,
      },
      this
    );

    this.databaseHelper = new DatabaseHelper(this);

    this.config = require("../../config.json");
    this.earTensifiers = [
      "472714545723342848",
      "888267634687213669",
      "888268490199433236",
      "669256663995514900",
    ];

    this.totalCommandsUsed = 0;
    this.totalSongsPlayed = 0;
    this.timesCommandsUsed = [];
    this.timesSongsPlayed = [];
    this.usersStats = [];
    this.lastUpdatedDatabase = Date.now();
  }

  loadCommands() {
    commandsFolder.forEach((category) => {
      const categories = fs.readdirSync(
        `${process.cwd()}/src/commands/${category}/`
      );
      categories.forEach((command) => this.loadCommand(command, category));
    });
  }

  loadCommand(command, category) {
    const f = require(`${process.cwd()}/src/commands/${category}/${command}`);
    const cmd = new f(this, f);
    cmd.category = category;
    cmd.file = f;
    cmd.fileName = f.name;
    this.commands.set(cmd.name, cmd);
    if (cmd.aliases && Array.isArray(cmd.aliases)) {
      for (const alias of cmd.aliases) {
        this.aliases.set(alias, cmd);
      }
    }
    return cmd;
  }

  loadListeners() {
    listenersFolder.forEach(async (eventFolder) => {
      const events = fs
        .readdirSync(`./src/listeners/${eventFolder}`)
        .filter((c) => c.split(".").pop() === "js");
      if (eventFolder != "player") {
        events.forEach(async (eventStr) => {
          if (!events.length) throw Error("No event files found!");
          const file = require(`../listeners/${eventFolder}/${eventStr}`);
          const event = new file(this, file);
          const eventName =
            eventStr.split(".")[0].charAt(0).toLowerCase() +
            eventStr.split(".")[0].slice(1);
          this.on(eventName, (...args) => event.run(...args));
        });
      }
    });
  }

  loadPlayerListeners() {
    const events = fs
      .readdirSync("./src/listeners/player")
      .filter((c) => c.split(".").pop() === "js");
    events.forEach(async (eventStr) => {
      if (!events.length) throw Error("No event files found!");
      const file = require(`../listeners/player/${eventStr}`);
      const event = new file(this, file);
      const eventName =
        eventStr.split(".")[0].charAt(0).toLowerCase() +
        eventStr.split(".")[0].slice(1);
      this.music.on(eventName, (...args) => event.run(...args));
    });
  }

  shardMessage(channelId, message, isEmbed) {
    const channel = this.channels.cache.get(channelId);
    if (channel) {
      if (!isEmbed) {
        channel.send(message);
      } else {
        channel.send({ embeds: [message] });
      }
    }
  }

  reloadFile(fileToReload) {
    delete require.cache[require.resolve(fileToReload)];
    return require(fileToReload);
  }

  reloadCommands(commandsToReload) {
    if (commandsToReload.length > 0) {
      commandsToReload.forEach((c) => {
        if (c) {
          this.reloadFile(
            `${process.cwd()}/src/commands/${c.category}/${c.fileName}`
          );
          this.loadCommand(c.fileName, c.category);
          this.logger.info("Reloaded %s command", c.fileName);
        }
      });
    } else {
      this.commands.forEach((command) => {
        this.reloadFile(
          `${process.cwd()}/src/commands/${command.category}/${
            command.fileName
          }`
        );
        this.logger.info("Reloaded %s command", command.fileName);
      });
      this.loadCommands();
    }
  }

  async login(token) {
    await findUpdate.check().then(() => {
      super.login(token);

      this.loadCommands();
      this.loadListeners();
    });
  }
};
