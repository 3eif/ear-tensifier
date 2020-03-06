const mongoose = require("mongoose");

const serverSchema = mongoose.Schema({
  serverID: String,
  serverName: String,
  prefix: String,
  ignore: Array,
});

module.exports = mongoose.model("servers", serverSchema);