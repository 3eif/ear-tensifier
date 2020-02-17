const mongoose = require("mongoose");

const serverSchema = mongoose.Schema({
  serverID: Number,
  serverName: String,
  prefix: String,
  ignore: Array,
});

module.exports = mongoose.model("servers", serverSchema);