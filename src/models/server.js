const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
	serverID: String,
	prefix: String,
	ignore: Array,
	roleSystem: Boolean,
});

module.exports = mongoose.model('servers', serverSchema);