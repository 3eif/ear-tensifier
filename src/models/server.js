const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
	serverID: String,
	prefix: String,
	ignore: Array,
	player: Map,
});

module.exports = mongoose.model('servers', serverSchema);