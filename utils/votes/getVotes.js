const DBL = require("dblapi.js");
const { post } = require("../tokens.json");

module.exports = async () => {
    const dbl = new DBL(post["topGG"]["token"], { webhookPort: 5000, webhookAuth: post["topGG"]["password"] }, client);

    dbl.getVotes().then(votes => {
        return votes;
    });
}