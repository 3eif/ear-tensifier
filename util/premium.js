const users = require("../models/user.js");

module.exports = async (user, pledge) => {
    switch (pledge) {
        case 'Supporter': {
            users.findOne({
                authorID: user
            }, async (err, u) => {
                if (err) console.log(err);
                if (u.supporter) return true;
                else return false;
            });
            break;
        }
        case 'Supporter+': {
            users.findOne({
                authorID: user
            }, async (err, u) => {
                if (err) console.log(err);
                if (u.supporterPlus) return true;
                else return false;
            });
            break;
        }
        case 'Supporter++': {
            users.findOne({
                authorID: user
            }, async (err, u) => {
                if (err) console.log(err);
                if (u.supporterPlusPlus) return true;
                else return false;
            });
            break;
        }
        case 'Supporter ∞': {
            users.findOne({
                authorID: user
            }, async (err, u) => {
                if (err) console.log(err);
                if (u.supporterInfinite) return true;
                else return false;
            });
            break;
        }
    }
}