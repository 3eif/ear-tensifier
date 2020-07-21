const fs = require('fs');
const posts = fs.readdirSync('./src/utils/post');
const jsposts = posts.filter(c => c.split('.').pop() === 'js');
if (!posts.length) throw Error('No post files found!');
const bot = require('../models/bot.js');

module.exports = (client, servers, count) => {
	bot.findOne({ clientID: client.user.id }).then(async b => {
		if(b.lastPosted < Date.now() - client.settings.postCooldown) {
			b.lastPosted = Date.now();
			post();
		}
		else return;
		b.save().catch(e => client.log(e));
	});

	function post() {
		for (let i = 0; i < jsposts.length; i++) {
			if (!jsposts.length) throw Error('No javascript post files found!');
			require(`../utils/post/${jsposts[i]}`)(client, servers, count);
		}
	}
};