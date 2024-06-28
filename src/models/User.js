const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  guildId: { type: String, required: true },
  balance: { type: Number, default: 0 }, // Starting balance
  lastDailyClaim: { type: Date, default: null }, // Track when the user last claimed their daily reward
  // Add other fields here if needed (e.g., inventory, level, etc.)
});

module.exports = mongoose.model('User', userSchema);
