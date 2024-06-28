const { SlashCommandBuilder } = require('discord.js');
const User = require('../../../models/User.js');
const ms = require('ms');

const dailyReward = 100; // Amount of coins to reward
const cooldown = 24 * 60 * 60 * 1000; // Cooldown in milliseconds (24 hours)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    try {
      let user = await User.findOne({ userId, guildId });
      if (!user) {
        user = await User.create({
          userId,
          guildId,
          balance: 0,
          lastDailyClaim: 0,
        });
      }

      const now = Date.now();

      if (now - user.lastDailyClaim < cooldown) {
        const remainingTime = ms(cooldown - (now - user.lastDailyClaim));
        return interaction.reply({
          content: `You already claimed your daily reward. Please wait ${remainingTime}.`,
        });
      }

      user.balance += dailyReward;
      user.lastDailyClaim = now;
      await user.save();

      await interaction.reply({
        content: `You claimed your daily reward of ${dailyReward} coins! Your new balance is ${user.balance}.`,
      });
    } catch (error) {
      console.error('Error in daily command:', error);
      await interaction.reply({
        content: 'An error occurred while processing your request.',
        ephemeral: true,
      });
    }
  },
};
