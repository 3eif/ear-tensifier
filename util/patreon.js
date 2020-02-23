const Discord = require("discord.js");
const mongoose = require("mongoose");
const { mongoUsername, mongoPass } = require("../tokens.json");
const users = require("../models/user.js");

mongoose.connect(`mongodb+srv://${mongoUsername}:${mongoPass}@tetracyl-unhxi.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = async (user, pledge) => {
    switch (pledge) {
        case 'Remove': {
            users.findOne({
                authorID: user.id
            }, async (err, u) => {
                if (err) console.log(err);
                if (!u) {
                    const newUser = new users({
                        authorID: user.id,
                        authorName: user.tag,
                        bio: "",
                        songsPlayed: 0,
                        commandsUsed: 0,
                        blocked: true,
                        supporter: false,
                        supporterPlus: false,
                        supporterPlusPlus: false,
                        supporterInfinite: false,
                        developer: false,
                    });
                    newUser.save().catch(e => console.log(e));
                } else {
                    u.supporter = false;
                    u.supporterPlus = false;
                    u.supporterPlusPlus = false;
                    u.supporterInfinite = false;
                }
                await u.save().catch(e => console.log(e));
            });
            break;
        }
        case 'Supporter': {
            users.findOne({
                authorID: user.id
            }, async (err, u) => {
                if (err) console.log(err);
                if (!u) {
                    const newUser = new users({
                        authorID: user.id,
                        authorName: user.tag,
                        bio: "",
                        songsPlayed: 0,
                        commandsUsed: 0,
                        blocked: true,
                        supporter: true,
                        supporterPlus: false,
                        supporterPlusPlus: false,
                        supporterInfinite: false,
                        developer: false,
                    });
                    newUser.save().catch(e => console.log(e));
                } else {
                    u.supporter = true;
                    u.supporterPlus = false;
                    u.supporterPlusPlus = false;
                    u.supporterInfinite = false;
                }
                await u.save().catch(e => console.log(e));
            });
            break;
        }
        case 'Supporter+': {
            users.findOne({
                authorID: user.id
            }, async (err, u) => {
                if (err) console.log(err);
                if (!u) {
                    const newUser = new users({
                        authorID: user.id,
                        authorName: user.tag,
                        bio: "",
                        songsPlayed: 0,
                        commandsUsed: 0,
                        blocked: true,
                        supporter: true,
                        supporterPlus: true,
                        supporterPlusPlus: false,
                        supporterInfinite: false,
                        developer: false,
                    });
                    newUser.save().catch(e => console.log(e));
                } else {
                    u.supporter = true;
                    u.supporterPlus = true;
                    u.supporterPlusPlus = false;
                    u.supporterInfinite = false;
                }
                await u.save().catch(e => console.log(e));
            });
            break;
            break;
        }
        case 'Supporter++': {
            users.findOne({
                authorID: user.id
            }, async (err, u) => {
                if (err) console.log(err);
                if (!u) {
                    const newUser = new users({
                        authorID: user.id,
                        authorName: user.tag,
                        bio: "",
                        songsPlayed: 0,
                        commandsUsed: 0,
                        blocked: true,
                        supporter: true,
                        supporterPlus: true,
                        supporterPlusPlus: true,
                        supporterInfinite: false,
                        developer: false,
                    });
                    newUser.save().catch(e => console.log(e));
                } else {
                    u.supporter = true;
                    u.supporterPlus = true;
                    u.supporterPlusPlus = true;
                    u.supporterInfinite = false;
                }
                await u.save().catch(e => console.log(e));
            });
            break;
            break;
        }
        case 'Supporter ∞': {
            users.findOne({
                authorID: user.id
            }, async (err, u) => {
                if (err) console.log(err);
                if (!u) {
                    const newUser = new users({
                        authorID: user.id,
                        authorName: user.tag,
                        bio: "",
                        songsPlayed: 0,
                        commandsUsed: 0,
                        blocked: true,
                        supporter: true,
                        supporterPlus: true,
                        supporterPlusPlus: true,
                        supporterInfinite: true,
                        developer: false,
                    });
                    newUser.save().catch(e => console.log(e));
                } else {
                    u.supporter = true;
                    u.supporterPlus = true;
                    u.supporterPlusPlus = true;
                    u.supporterInfinite = true;
                }
                await u.save().catch(e => console.log(e));
            });
            break;
            break;
        }
    }
}