const DBL = require("dblapi.js");
const { post } = require("../tokens.json");

module.exports = async (user) => {
    const dbl = new DBL(post["topGG"]["token"], { webhookPort: 5000, webhookAuth: post["topGG"]["password"] }, client);

    dbl.hasVoted(user.id).then(voted => {
        return true;
    });
}