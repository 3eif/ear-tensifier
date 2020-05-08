const fetch = require('node-fetch');

module.exports = async (client, servers, users) => {
    await fetch('https://statcord.com/mason/stats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: client.user.id,
            key: process.env.STATCORD_TOKEN,
            servers: servers,
            users: users,
            commands :'0',
            active:'0',
            popular:[],
        }),
    }).then(res => res.json())
    .then(json => console.log(json));
};