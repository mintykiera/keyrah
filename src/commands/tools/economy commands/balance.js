const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../../models/User.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Returns the balance of yourself or another user')
    .addUserOption((option) =>
      option.setName('target').setDescription("View this user's balance")
    ),
  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const guildId = interaction.guild.id;

    try {
      const user = await User.findOne({ userId: targetUser.id, guildId });

      if (!user) {
        return interaction.reply({
          content: `${targetUser.tag} doesn't have an account yet.`,
          ephemeral: true,
        });
      } else {
        const embed = new EmbedBuilder()
          .setTitle(`${targetUser.username}'s balance`)
          .setColor(0x0099ff)
          .setDescription(`**Balance:** $${user.balance}`); // Use description for balance

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      await interaction.reply({
        content: 'An error occurred while fetching the balance.',
        ephemeral: true,
      });
    }
  },
};
