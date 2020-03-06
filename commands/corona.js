const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const novelcovid = require("novelcovid")

module.exports = {
    name: "corona",
    description: "Shows stats about the corona virus.",
    async execute(client, message, args) { 
        let data2;
        novelcovid.all() 
            .then((data) => message.channel.send(`Cases: ${data.cases}\nDeaths: ${data.deaths}\nRecovered: ${data.recovered}`))
            .catch((err) => console.error(err));
        
    },
};