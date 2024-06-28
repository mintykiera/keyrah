const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../../models/User.js'); // Replace with your actual path

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Displays the server leaderboard')
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('The type of leaderboard (balance or exp)')
        .setRequired(true)
        .addChoices(
          { name: 'Balance', value: 'balance' },
          { name: 'Experience', value: 'exp' }
        )
    ),

  async execute(interaction) {
    const leaderboardType = interaction.options.getString('type');

    try {
      const guildId = interaction.guild.id;

      let users;

      if (leaderboardType === 'balance') {
        users = await User.find({ guildId, balance: { $gt: 0 } }) // Find users with balance > 0
          .sort({ balance: -1 }) // Sort in descending order
          .limit(10); // Show top 10
      } else if (leaderboardType === 'exp') {
        // Assuming you have an 'exp' field in your User model
        users = await User.find({ guildId }).sort({ exp: -1 }).limit(10);
      }

      if (users.length === 0) {
        return interaction.reply({
          content: 'The leaderboard is empty for this category.',
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setTitle(`${leaderboardType.toUpperCase()} Leaderboard`)
        .setColor(color);

      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const member = await interaction.guild.members.fetch(user.userId);
        const name = member.displayName; // Get user's display name

        if (leaderboardType === 'balance') {
          embed.addFields({
            name: `${i + 1}. ${name}`,
            value: `$${user.balance}`,
            inline: false,
          });
        } else if (leaderboardType === 'exp') {
          embed.addFields({
            name: `${i + 1}. ${name}`,
            value: `${user.exp} EXP`,
            inline: false,
          });
        }
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      await interaction.reply({
        content: 'An error occurred while fetching the leaderboard.',
        ephemeral: true,
      });
    }
  },
};
