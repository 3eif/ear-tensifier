const GBL = require('gblapi.js');
const { post } = require('../../tokens.json');
const Glenn = new GBL(post['glenBotListXYZ']['id'], post['glenBotListXYZ']['token']);

module.exports = async (servers) => {
	Glenn.updateStats(servers).then(console.log('Posted bot stats to glennbotlist.xyz'));
};