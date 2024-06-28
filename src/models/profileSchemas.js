const { DefaultUserAgent } = require('discord.js');
const mongoose = require('mongoose');

const profileSchemas = new mongoose.Schema({
  userId: { type: String, require: true, unique: true },
  serverId: { type: String, require: true },
  gems: { type: Number, default: 500 },
});

const model = mongoose.model('mercury, profileSchema');
module.exports = model;
