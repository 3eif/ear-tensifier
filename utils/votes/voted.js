const DBL = require("dblapi.js");
const { post } = require("../tokens.json");
const premium = require("../premium/premium.js");

module.exports = async (user) => {
    if(await premium(message.author.id, "Premium") == false) return true;

    const dbl = new DBL(post["topGG"]["token"], { webhookPort: 5000, webhookAuth: post["topGG"]["password"] }, client);
    dbl.hasVoted(user.id).then(voted => {
        return true;
    });
}