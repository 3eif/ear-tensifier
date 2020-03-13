const fs = require("fs")
const posts = fs.readdirSync('./utils/post');
const jsposts = posts.filter(c => c.split('.').pop() === 'js');
if (!posts.length) throw Error('No post files found!');

module.exports = (client, servers, shards) => {
    for (let i = 0; i < jsposts.length; i++) {
        if (!jsposts.length) throw Error('No javascript post files found!');
        require(`../post/${jsposts[i]}`)(client, servers, shards);
    }
};