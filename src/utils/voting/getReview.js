const axios = require('axios');

module.exports = async (user) => {
    await axios.get(
        `https://bots.ondiscord.xyz/bot-api/bots/${process.env.DISCORD_ID}/review?owner=${user.id}`,
        {
            method: 'GET',
            headers: {
                Authorization: process.env.BOTSONDISCORD_TOKEN,
            },
        },
    ).then(function(res) {
        return res.data.exists;
    }).catch(function(error) {
        console.log(error);
    });
};