const { post } = require('../../tokens.json');
const fetch = require("node-fetch")

module.exports = async (client, servers, shards, shardID, users) => {
    fetch(`https://cloud-botlist.xyz/api/bots/${client.user.id}`, {
        method: "POST",
        headers: {
        Authorization: post["cloudBotListXYZ"]["token"],
        "Content-Type": "application/json"
        },
        body: JSON.stringify({ guilds: servers, users: users })
    }).then(res => {
        console.log("Posted bot stats to cloud-botlist.xyz")
    });
}